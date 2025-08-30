package com.usyd.catams.application.command;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.usyd.catams.adapter.persistence.ApprovalTaskMapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.adapter.web.dto.ApproveActionRequest;
import com.usyd.catams.domain.enums.ApprovalStep;
import com.usyd.catams.domain.enums.WorkStatus;
import com.usyd.catams.domain.model.ApprovalTask;
import com.usyd.catams.domain.model.WorkEntry;
import com.usyd.catams.domain.service.ApprovalStateMachine;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApproveWorkEntryHandler {
    private final WorkEntryMapper workEntryMapper;
    private final ApprovalTaskMapper taskMapper;
    private final ApprovalStateMachine sm = new ApprovalStateMachine();

    public ApproveWorkEntryHandler(WorkEntryMapper w, ApprovalTaskMapper t) {
        this.workEntryMapper = w; this.taskMapper = t;
    }

    @Transactional
    public void handle(ApproveActionRequest req, Long operatorId) {
        WorkEntry entry = workEntryMapper.selectById(req.entryId());
        if (entry == null) throw new IllegalArgumentException("工时不存在");

        var step = ApprovalStep.valueOf(req.step());
        var action = req.action().toUpperCase();

        WorkStatus target = switch (step) {
            case LECTURER -> "APPROVE".equals(action) ? WorkStatus.APPROVED_BY_LECTURER : WorkStatus.REJECTED;
            case TUTOR    -> "APPROVE".equals(action) ? WorkStatus.APPROVED_BY_TUTOR    : WorkStatus.REJECTED;
            case HR       -> "APPROVE".equals(action) ? WorkStatus.FINAL_APPROVED       : WorkStatus.REJECTED;
        };

        sm.transit(entry, target, step);

        // 乐观锁更新（带 version）
        int updated = workEntryMapper.update(entry,
                Wrappers.<WorkEntry>lambdaUpdate()
                        .eq(WorkEntry::getId, entry.getId())
                        .eq(WorkEntry::getVersion, entry.getVersion())
                        .set(WorkEntry::getStatus, entry.getStatus())
                        .set(WorkEntry::getVersion, entry.getVersion() + 1)
        );
        if (updated == 0) throw new IllegalStateException("并发修改，请重试");

        // 记录审批轨迹
        var task = new ApprovalTask();
        task.setEntryId(entry.getId());
        task.setStep(step);
        task.setAction(action);
        task.setComment(req.comment());
        task.setActorId(operatorId);
        taskMapper.insert(task);

        // TODO: 预算释放/实扣、通知、缓存失效、审计日志
    }
}
