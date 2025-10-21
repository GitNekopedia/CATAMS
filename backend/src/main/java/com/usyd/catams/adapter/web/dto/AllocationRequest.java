package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.util.List;

@Data
public class AllocationRequest {
    private Long unitId;
    private Long tutorId;
    private List<WeekHoursDTO> allocations;

}

