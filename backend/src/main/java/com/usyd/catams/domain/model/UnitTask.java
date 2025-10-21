package com.usyd.catams.domain.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UnitTask {
    private Long id;
    private Long unitId;
    private Long typeId;
    private String name;
    private Boolean isActive;
    private BigDecimal phdPayRate;
    private BigDecimal nonPhdPayRate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
