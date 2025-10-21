package com.usyd.catams.domain.model;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("unit_assignment")
public class UnitAssignment {
    private Long id;
    private Long unitId;
    private Long userId;
    private String role; // Lecturer / Tutor / HR
    private BigDecimal payRate;
    private BigDecimal quotaHours;
    private LocalDateTime createdAt;

}
