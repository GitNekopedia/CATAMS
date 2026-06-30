package com.usyd.catams.application.command;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.catams.adapter.persistence.*;
import com.usyd.catams.adapter.web.dto.WorkEntrySubmitRequest;
import com.usyd.catams.application.service.NotificationService;
import com.usyd.catams.domain.enums.Action;
import com.usyd.catams.domain.enums.ApprovalStep;
import com.usyd.catams.domain.enums.WorkSource;
import com.usyd.catams.domain.enums.WorkStatus;
import com.usyd.catams.domain.model.ApprovalTask;
import com.usyd.catams.domain.model.CourseUnit;
import com.usyd.catams.domain.model.UnitAssignment;
import com.usyd.catams.domain.model.WorkEntry;
import com.usyd.catams.infrastructure.cache.CourseMetaCache;
import com.usyd.catams.infrastructure.cache.RedisWorkEntryCache;
import com.usyd.catams.infrastructure.exception.BusinessCode;
import com.usyd.catams.infrastructure.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Slf4j
@Service
public class SubmitWorkEntryHandler {
    private final WorkEntryMapper workEntryMapper;
    private final ApprovalTaskMapper approvalTaskMapper;
    private final PlannedTaskAllocationMapper plannedTaskAllocationMapper;
    private final CourseUnitMapper courseUnitMapper;

    private final CourseMetaCache courseMetaCache;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;
    private final NotificationService notificationService;


    @Transactional
    public Long handle(Long submitterId, WorkEntrySubmitRequest req) {
        CourseUnit unit = null;

        // 先尝试缓存
        try {
            unit = courseMetaCache.getById(req.unitId());
        } catch (Exception e) {
            log.warn("Cache lookup failed for unitId={}, fallback to DB", req.unitId(), e);
        }

        // 缓存没有命中，就查数据库
        if (unit == null) {
            unit = courseUnitMapper.findById(req.unitId());
        }

        // 兜底校验
        if (unit == null) {
            throw new IllegalStateException("课程不存在");
        }

        // 根据 task 获取 workType
        Long taskId = req.taskId();
        String workType = taskMapper.getTaskTypeById(taskId);

        // 获取当前的 pay_rate 作为快照
        BigDecimal payRateSnapShot = plannedTaskAllocationMapper.getPayRateByTaskId(taskId);
        if (payRateSnapShot == null) {
            throw new IllegalStateException("未找到该任务的 pay_rate");
        }

        LocalDateTime now = LocalDateTime.now();

        // ⭐ 关键改动：先按唯一键查已有记录
        WorkEntry existing = workEntryMapper.selectOne(new LambdaQueryWrapper<WorkEntry>()
                .eq(WorkEntry::getTutorId, submitterId)
                .eq(WorkEntry::getUnitId, req.unitId())
                .eq(WorkEntry::getOriginPlannedId, req.originPlannedId())
                .eq(WorkEntry::getWeekStart, req.weekStart())
        );

        if (existing != null) {
            // 已经有记录，分两种情况：REJECTED 可以重新提交，其余一律不允许
            if (existing.getStatus() == WorkStatus.REJECTED) {
                // ⭐ 当作“重新提交”：更新这条记录
                existing.setHours(req.hours());
                existing.setDescription(req.description());
                existing.setSource(req.substitute() ? WorkSource.ADHOC : WorkSource.PLANNED);
                existing.setWorkType(workType);
                existing.setPayRateSnapshot(payRateSnapShot);
                existing.setStatus(WorkStatus.SUBMITTED);
                existing.setUpdatedAt(now);
                // version / createdAt 保持不动（按你现在的设计）

                workEntryMapper.updateById(existing);

                // 重新插入一条 ApprovalTask 记录这次提交
                var task = new ApprovalTask();
                task.setEntryId(existing.getId());
                task.setStep(ApprovalStep.TUTOR);
                task.setAction(Action.SUBMITTED);
                task.setComment(null);
                task.setActorId(submitterId);
                String name = userMapper.findNameById(submitterId);
                task.setActorName(name);
                approvalTaskMapper.insert(task);

                notificationService.publishWorkEntrySubmitted(submitterId, existing.getId(), taskId);

                return existing.getId();
            } else {
                // 其它状态：SUBMITTED / APPROVED / FINAL_APPROVED 等，一律不允许重复提交
                throw new BusinessException(BusinessCode.WORK_ENTRY_DUPLICATE);
            }
        }

        // ⭐ 下面是“全新提交”的原始插入逻辑（保持不变）
        var entry = new WorkEntry();
        entry.setPayRateSnapshot(payRateSnapShot);
        entry.setTutorId(submitterId);
        entry.setUnitId(req.unitId());
        entry.setUnitCode(unit.getCode());
        entry.setUnitName(unit.getName());
        entry.setTaskId(req.taskId());
        entry.setOriginPlannedId(req.originPlannedId());
        entry.setWeekStart(req.weekStart());
        entry.setHours(req.hours());
        entry.setDescription(req.description());
        entry.setWorkType(workType);

        // 根据 substitute 标记来源
        entry.setSource(req.substitute() ? WorkSource.ADHOC : WorkSource.PLANNED);
        entry.setStatus(WorkStatus.SUBMITTED);
        entry.setCreatedAt(now);
        entry.setUpdatedAt(now);
        entry.setVersion(0);

        workEntryMapper.insert(entry);

        ApprovalTask task = new ApprovalTask();
        task.setEntryId(entry.getId());
        task.setStep(ApprovalStep.TUTOR);
        task.setAction(Action.SUBMITTED);
        task.setComment(null);
        task.setActorId(submitterId);
        String name = userMapper.findNameById(submitterId);
        task.setActorName(name);
        approvalTaskMapper.insert(task);

        notificationService.publishWorkEntrySubmitted(submitterId, entry.getId(), taskId);

        return entry.getId();
    }

}


