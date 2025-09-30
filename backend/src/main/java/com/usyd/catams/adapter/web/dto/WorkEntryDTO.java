package com.usyd.catams.adapter.web.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class WorkEntryDTO {
    Long id;
    Long tutorId;
    String tutorName;
    Long unitId;
    private String unitCode;
    String unitName;
    LocalDate weekStart;
    String workType;
    BigDecimal hours;
    String description;
    private BigDecimal payRateSnapshot;
    String status;    // DRAFT / SUBMITTED / APPROVED / REJECTED
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    private Set<String> actions;

    public WorkEntryDTO(Long id, Long tutorId, String tutorName, Long unitId, String unitCode, String unitName, LocalDate weekStart, String workType, BigDecimal hours, String description, BigDecimal payRateSnapshot, LocalDateTime createdAt, LocalDateTime updatedAt, Set<String> actions) {

        this.id = id;
        this.tutorId = tutorId;
        this.tutorName = tutorName;
        this.unitId = unitId;
        this.unitCode = unitCode;
        this.unitName = unitName;
        this.weekStart = weekStart;
        this.workType = workType;
        this.hours = hours;
        this.description = description;
        this.payRateSnapshot = payRateSnapshot;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.actions = actions;
    }
    public WorkEntryDTO() {
    }
}
