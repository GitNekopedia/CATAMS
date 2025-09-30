package com.usyd.catams.domain.model;

import com.baomidou.mybatisplus.annotation.*;
import com.usyd.catams.domain.enums.WorkSource;
import com.usyd.catams.domain.enums.WorkStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 工时记录表（支持计划、任务维度、替班）
 */
@Data
@TableName("work_entry")
public class WorkEntry {
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 提交人（Tutor，本人或代课人） */
    private Long tutorId;

    /** 课程信息 */
    private Long unitId;
    private String unitCode;   // 冗余快照，避免后续 join
    private String unitName;   // 冗余快照

    /** 任务关联 */
    private Long taskId;           // 冗余字段（unit_task.id），方便直接查
    private Long originPlannedId;  // 对应 planned_task_allocation.id

    /** 周起始日期 */
    private LocalDate weekStart;

    /** 工时数 */
    private BigDecimal hours;

    /** 工作类型（Lab, Tutorial …） */
    private String workType;

    /** 描述 */
    private String description;

    /** 工资快照 */
    private BigDecimal payRateSnapshot;

    /** 来源：计划生成 / 临时新增 */
    private WorkSource source;   // 建议对应枚举：PLANNED / ADHOC

    /** 审批状态 */
    private WorkStatus status;

    /** 乐观锁版本号 */
    @Version
    private Integer version;

    /** 创建/更新时间 */
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
