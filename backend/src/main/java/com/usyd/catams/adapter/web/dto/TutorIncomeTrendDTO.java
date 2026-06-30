package com.usyd.catams.adapter.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutorIncomeTrendDTO {
    private String month;       // 格式 "2025-01"
    private Double totalIncome; // 当月收入总额
    private Double totalHours;  // 当月总工时
}
