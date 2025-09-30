package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.util.Map;

@Data
public class WeekHoursDTO {
    private Long taskId;
    private Map<String, Double> weekHours; // 前端传 Week1..Week12
}