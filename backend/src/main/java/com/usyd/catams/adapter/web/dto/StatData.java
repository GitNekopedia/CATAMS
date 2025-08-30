package com.usyd.catams.adapter.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatData {
    private int workCount;            // 工时记录数
    private double remainingBudget;   // 剩余预算
    private double approvalProgress;  // 审批进度（0.0~1.0）
}
