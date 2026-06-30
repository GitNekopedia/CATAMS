package com.usyd.catams.adapter.web.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TutorIncomeDetailDTO {
    private Long tutorId;
    private String tutorName;
    private Long entryId;
    private String unitCode;
    private String unitName;
    private String taskName;
    private LocalDate weekStart;
    private BigDecimal hours;
    private BigDecimal payRate;
    private BigDecimal amount;
}
