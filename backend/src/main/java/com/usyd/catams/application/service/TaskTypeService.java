package com.usyd.catams.application.service;

import com.usyd.catams.adapter.persistence.TaskTypeMapper;
import com.usyd.catams.adapter.web.dto.DtoMapper;
import com.usyd.catams.adapter.web.dto.TaskTypeDTO;
import com.usyd.catams.domain.model.UnitTaskType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskTypeService {
    private final TaskTypeMapper taskTypeMapper;

    public TaskTypeService(TaskTypeMapper taskTypeMapper) {
        this.taskTypeMapper = taskTypeMapper;
    }

    @Transactional
    public TaskTypeDTO createTaskType(Long unitId, String name, BigDecimal phdPayRate, BigDecimal nonPhdPayRate) {
        // 防止重复
        UnitTaskType existing = taskTypeMapper.findByUnitAndName(unitId, name);
        if (existing != null) {
            throw new IllegalArgumentException("Task type already exists for this unit");
        }

        UnitTaskType type = new UnitTaskType();
        type.setUnitId(unitId);
        type.setName(name);
        type.setPhdPayRate(phdPayRate);
        type.setNonPhdPayRate(nonPhdPayRate);

        taskTypeMapper.insert(type);
        return DtoMapper.toTaskTypeDTO(type);
    }

    public TaskTypeDTO getTaskType(Long id) {
        UnitTaskType type = taskTypeMapper.findById(id);
        return type != null ? DtoMapper.toTaskTypeDTO(type) : null;
    }

    public List<TaskTypeDTO> getTaskTypesByUnit(Long unitId) {
        return taskTypeMapper.findByUnitId(unitId)
                .stream()
                .map(DtoMapper::toTaskTypeDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskTypeDTO  updateTaskType(Long id, String name) {
        UnitTaskType type = taskTypeMapper.findById(id);
        if (type == null) {
            throw new IllegalArgumentException("Task type not found");
        }
        type.setName(name);
        taskTypeMapper.update(type);
        return DtoMapper.toTaskTypeDTO(type);
    }

    @Transactional
    public void deleteTaskType(Long id) {
        UnitTaskType type = taskTypeMapper.findById(id);
        if (type == null) {
            throw new IllegalArgumentException("Task type not found");
        }
        taskTypeMapper.delete(id);
    }
}
