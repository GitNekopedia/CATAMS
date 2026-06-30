package com.usyd.catams.adapter.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TutorIncomeDTO {
    private Long tutorId;
    private String tutorName;
    private String month;
    private BigDecimal totalHours;
    private BigDecimal totalIncome;
}
