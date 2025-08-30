package com.usyd.catams.domain.model;

import com.baomidou.mybatisplus.annotation.*;
import com.usyd.catams.domain.enums.WorkStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@TableName("work_entry")
public class WorkEntry {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long tutorId;
    private Long unitId;
    private LocalDate weekStart;
    private BigDecimal hours;
    private String workType;
    private String description;
    private BigDecimal payRateSnapshot;
    private WorkStatus status;
    @Version
    private Integer version;
}
