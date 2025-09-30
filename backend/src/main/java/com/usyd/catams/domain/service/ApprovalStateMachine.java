package com.usyd.catams.domain.service;

import com.usyd.catams.domain.enums.Action;
import com.usyd.catams.domain.enums.ApprovalStep;
import com.usyd.catams.domain.enums.WorkStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ApprovalStateMachine {
    private static final Map<WorkStatus, Map<String, WorkStatus>> transitions = Map.of(
            // Tutor 提交
            WorkStatus.DRAFT, Map.of(
                    "TUTOR:SUBMIT", WorkStatus.SUBMITTED
            ),
            // Lecturer 审批
            WorkStatus.SUBMITTED, Map.of(
                    "LECTURER:APPROVE", WorkStatus.APPROVED_BY_LECTURER,
                    "LECTURER:REJECT", WorkStatus.REJECTED
            ),
            // HR 审批
            WorkStatus.APPROVED_BY_LECTURER, Map.of(
                    "HR:APPROVE", WorkStatus.FINAL_APPROVED,
                    "HR:REJECT", WorkStatus.REJECTED
            )
    );

    public WorkStatus next(WorkStatus current, ApprovalStep step, Action action) {
        var key = step + ":" + action;
        var map = transitions.get(current);
        if (map == null || !map.containsKey(key)) {
            throw new IllegalStateException("非法审批流转: " + current + " → " + key);
        }
        return map.get(key);
    }
}
