package com.usyd.catams.adapter.web.dto;

import com.usyd.catams.domain.model.UnitTask;
import com.usyd.catams.domain.model.UnitTaskType;

import java.time.format.DateTimeFormatter;

public class DtoMapper {
    private static final DateTimeFormatter F = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static TaskTypeDTO toTaskTypeDTO(UnitTaskType model) {
        TaskTypeDTO dto = new TaskTypeDTO();
        dto.setId(model.getId());
        dto.setUnitId(model.getUnitId());
        dto.setName(model.getName());
        dto.setPhdPayRate(model.getPhdPayRate());
        dto.setNonPhdPayRate(model.getNonPhdPayRate());
        dto.setCreatedAt(model.getCreatedAt() != null ? model.getCreatedAt().format(F) : null);
        dto.setUpdatedAt(model.getUpdatedAt() != null ? model.getUpdatedAt().format(F) : null);
        return dto;
    }

    public static TaskDTO toTaskDTO(UnitTask model) {
        TaskDTO dto = new TaskDTO();
        dto.setId(model.getId());
        dto.setUnitId(model.getUnitId());
        dto.setTypeId(model.getTypeId());
        dto.setName(model.getName());
        dto.setIsActive(model.getIsActive());
        dto.setPhdPayRate(model.getPhdPayRate());
        dto.setNonPhdPayRate(model.getNonPhdPayRate());
        dto.setCreatedAt(model.getCreatedAt() != null ? model.getCreatedAt().format(F) : null);
        dto.setUpdatedAt(model.getUpdatedAt() != null ? model.getUpdatedAt().format(F) : null);
        return dto;
    }
}
