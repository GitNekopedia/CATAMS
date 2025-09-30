package com.usyd.catams.domain.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UnitTaskType {
    private Long id;
    private Long unitId;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
