package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UnitAssignmentDTO {
    private Long id;
    private Long unitId;
    private String courseCode;
    private String courseName;
    private String semester;
    private Long userId;
    private String userName;
    private String userEmail;
    private String role;
    private Double quotaHours;
    private BigDecimal actualHours;
    private BigDecimal actualPayTotal;
}
