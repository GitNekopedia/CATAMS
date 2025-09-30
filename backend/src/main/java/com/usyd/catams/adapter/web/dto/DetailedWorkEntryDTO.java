package com.usyd.catams.adapter.web.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class DetailedWorkEntryDTO extends WorkEntryDTO {
    /**
     * 工时记录的审批流（按顺序）
     */
    private List<ApprovalTaskDTO> approvalTasks;

}
