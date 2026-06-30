package com.usyd.catams.adapter.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LecturerOverviewDTO {
    private int courseCount;             // 负责课程数量
    private int pendingCount;            // 待审批工时数
    private int approvedCount;           // 已审批工时数
    private double approvalRate;         // 审批率 (%)
    private double averageBudgetUsage;   // 平均预算使用率 (%)
    private double totalRemainingBudget; // 剩余预算 (小时)
}
