package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TutorOfCourseDTO {
    private Long id;
    private String name;
    private BigDecimal payRate;

}
