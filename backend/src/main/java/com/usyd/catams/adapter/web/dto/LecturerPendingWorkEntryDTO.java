package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LecturerPendingWorkEntryDTO {
    private Long workEntryId;     // 工时记录 ID
    private Long tutorId;         // 助教 ID
    private String tutorName;     // 助教姓名

    private Long unitId;          // 课程 ID
    private String unitCode;      // 课程代码
    private String unitName;      // 课程名称

    private LocalDate weekStart;  // 周起始日期
    private String workType;      // 工作类型
    private Double hours;         // 工时数
    private String description;   // 描述
    private String status;        // 工时状态

    // 审批任务相关信息
    private Long approvalTaskId;  // 对应的审批任务 ID
    private String step;          // 审批步骤（LECTURER/TUTOR/HR）
    private String action;        // 审批动作（APPROVE/REJECT/null）
    private String taskCreatedAt; // 审批任务创建时间
    private String updatedAt;     // 工时记录更新时间
}
