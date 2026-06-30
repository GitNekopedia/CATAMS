package com.usyd.catams.adapter.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * HR 仪表盘概览数据 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrOverviewDTO {
    private long totalCourses;          // 课程总数
    private long totalTutors;           // 导师数量
    private long pendingApprovals;      // 待审批工时数量
    private double totalBudgetHours;    // 总预算工时
    private double remainingBudgetHours; // 剩余预算工时
}

