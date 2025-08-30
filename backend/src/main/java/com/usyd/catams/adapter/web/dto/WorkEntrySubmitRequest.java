package com.usyd.catams.adapter.web.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record WorkEntrySubmitRequest(
        @NotNull Long tutorId,
        @NotNull Long unitId,
        @NotNull LocalDate weekStart,
        @NotBlank String workType,
        @NotNull @DecimalMin("0.1") @DecimalMax("20.0") BigDecimal hours,
        @NotBlank String description
) {}
