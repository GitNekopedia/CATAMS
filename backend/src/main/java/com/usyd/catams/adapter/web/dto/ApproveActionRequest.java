package com.usyd.catams.adapter.web.dto;

import com.usyd.catams.domain.enums.Action;
import com.usyd.catams.domain.enums.ApprovalStep;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApproveActionRequest(
        @NotNull
        Long entryId,
        @NotNull
        ApprovalStep step,    // LECTURER / TUTOR / HR
        @NotNull
        Action action,  // APPROVE / REJECT
        String comment
) {}
