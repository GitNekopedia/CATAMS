package com.usyd.catams.adapter.web.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record WorkEntrySubmitRequest(
        @NotNull Long originPlannedId,     // 计划分配ID
        @NotNull Long taskId,              // 任务ID
        @NotNull Long unitId,              // 课程ID
        @NotNull LocalDate weekStart,      // 周起始日期
        @NotNull @DecimalMin("0.0") @DecimalMax("20.0") BigDecimal hours, // 实际工时
        String description,                // 备注（可选）
        boolean substitute                 // 是否代课（前端勾选时传 true）
) {}
