package com.usyd.catams.adapter.web.dto;

import lombok.Data;

@Data
public class PlannedAllocationDTO {
    private Long id;
    private Long unitId;
    private String unitCode;
    private String unitName;
    private Long tutorId;
    private Long taskId;
    private String taskName;
    private String typeName;
    private String weekStart;
    private Double plannedHours;
}
