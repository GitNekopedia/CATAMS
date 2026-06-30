package com.usyd.catams.adapter.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TutorOverviewDTO {
    private int courseCount;                // 负责课程数量
    private int pendingCount;               // 待审批工时数
    private int approvedCount;              // 已审批工时数
    private double unsubmittedWorkEntries;  // 待提交工时数
    private double approvalRate;            // 审批率 (%)
    private double totalQuotaHours;         // 总计通过工时数
}
