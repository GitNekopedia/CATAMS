package com.usyd.catams.domain.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PlannedTaskAllocationRecord {
    private Long id;
    private Long taskId;
    private Long tutorId;
    private LocalDate weekStart;
    private Double plannedHours;
    private String note;
    private Long createdBy;
}
