package com.usyd.catams.application.command;

import com.usyd.catams.adapter.persistence.ApprovalTaskMapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.adapter.web.dto.ApproveActionRequest;
import com.usyd.catams.domain.enums.WorkStatus;
import com.usyd.catams.domain.model.ApprovalTask;
import com.usyd.catams.domain.model.WorkEntry;
import com.usyd.catams.domain.service.ApprovalStateMachine;
import com.usyd.catams.infrastructure.exception.BusinessCode;
import com.usyd.catams.infrastructure.exception.BusinessException;
import com.usyd.catams.infrastructure.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ApproveWorkEntryHandler {

    private final WorkEntryMapper workEntryMapper;
    private final ApprovalStateMachine approvalStateMachine;
    private final ApprovalTaskMapper approvalTaskMapper;

    /**
     * 处理审批动作
     */
    @Transactional
    public void handle(ApproveActionRequest req, Long actorId, String actorName) {
        WorkEntry entry = workEntryMapper.selectById(req.entryId());
        if (entry == null) {
            throw new EntityNotFoundException("Work entry with ID=" + req.entryId() + " not found");
        }

        // 根据当前状态、审批人操作计算下一个状态
        WorkStatus nextStatus = approvalStateMachine.next(
                entry.getStatus(),
                req.step(),
                req.action()
        );
        if (nextStatus == null) {
            // ✅ 抛出业务异常：状态流转错误
            throw new BusinessException(BusinessCode.APPROVAL_STEP_INVALID,
                    "Invalid approval transition from " + entry.getStatus() + " via " + req.action());
        }

        // 更新工时状态
        entry.setStatus(nextStatus);
        workEntryMapper.updateById(entry);

        // 记录审批任务
        ApprovalTask task = new ApprovalTask();
        task.setEntryId(entry.getId());
        task.setStep(req.step());
        task.setAction(req.action());
        task.setComment(req.comment());
        task.setActorId(actorId);
        task.setActorName(actorName);
        approvalTaskMapper.insert(task);
    }
}
