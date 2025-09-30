package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApprovalTaskDTO {
    private Long entryId;
    private String step;    // LECTURER / TUTOR / HR
    private String action;  // APPROVE / REJECT / null (待处理)
    private String comment;
    private String actorName; // 审批人姓名
    private LocalDateTime processTime; // 审批时间
}
