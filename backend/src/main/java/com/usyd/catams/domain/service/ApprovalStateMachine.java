package com.usyd.catams.domain.service;

import com.usyd.catams.domain.enums.ApprovalStep;
import com.usyd.catams.domain.enums.WorkStatus;
import com.usyd.catams.domain.model.WorkEntry;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public class ApprovalStateMachine {

    private static final Map<WorkStatus, Set<WorkStatus>> TRANSITIONS = new EnumMap<>(WorkStatus.class);

    static {
        TRANSITIONS.put(WorkStatus.DRAFT, Set.of(WorkStatus.SUBMITTED));
        TRANSITIONS.put(WorkStatus.SUBMITTED, Set.of(WorkStatus.APPROVED_BY_LECTURER, WorkStatus.REJECTED));
        TRANSITIONS.put(WorkStatus.APPROVED_BY_LECTURER, Set.of(WorkStatus.APPROVED_BY_TUTOR, WorkStatus.REJECTED));
        TRANSITIONS.put(WorkStatus.APPROVED_BY_TUTOR, Set.of(WorkStatus.FINAL_APPROVED, WorkStatus.REJECTED));
        TRANSITIONS.put(WorkStatus.REJECTED, Set.of(WorkStatus.SUBMITTED));
        TRANSITIONS.put(WorkStatus.FINAL_APPROVED, EnumSet.noneOf(WorkStatus.class));
    }

    public void transit(WorkEntry entry, WorkStatus target, ApprovalStep step) {
        var allowed = TRANSITIONS.getOrDefault(entry.getStatus(), Set.of());
        if (!allowed.contains(target)) {
            throw new IllegalStateException("非法状态流转: " + entry.getStatus() + " -> " + target);
        }
        // 可加角色/操作者校验：不同 step 对应不同角色
        entry.setStatus(target);
    }
}
