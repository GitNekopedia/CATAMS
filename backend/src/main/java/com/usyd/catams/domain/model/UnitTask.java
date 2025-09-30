package com.usyd.catams.domain.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UnitTask {
    private Long id;
    private Long unitId;
    private Long typeId;
    private String name;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
