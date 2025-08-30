package com.usyd.catams.domain.model;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("course_unit")
public class CourseUnit {
    private Long id;

    private String code;           // 单元代码，如 "COMP5348"
    private String name;           // 课程名称，如 "System Design"
    private String semester;       // 学期，如 "2024S2"

    private LocalDate startDate;   // 开始日期
    private LocalDate endDate;     // 结束日期

    private BigDecimal totalBudgetHours;  // 总预算工时
    private BigDecimal remainingBudget;   // 剩余预算工时

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
