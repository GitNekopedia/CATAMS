package com.usyd.catams.domain.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UnitTaskType {
    private Long id;
    private Long unitId;
    private String name;
    private BigDecimal phdPayRate;
    private BigDecimal nonPhdPayRate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
