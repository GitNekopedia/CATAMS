package com.usyd.catams.adapter.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApproveActionRequest(
        @NotNull Long entryId,
        @NotBlank String step,    // LECTURER / TUTOR / HR
        @NotBlank String action,  // APPROVE / REJECT
        String comment
) {}
