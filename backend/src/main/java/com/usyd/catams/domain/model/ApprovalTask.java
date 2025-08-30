package com.usyd.catams.domain.model;

import com.baomidou.mybatisplus.annotation.*;
import com.usyd.catams.domain.enums.ApprovalStep;
import lombok.Data;

@Data
@TableName("approval_task")
public class ApprovalTask {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long entryId;
    private ApprovalStep step;
    private String action; // APPROVE/REJECT
    private String comment;
    private Long actorId;
}
