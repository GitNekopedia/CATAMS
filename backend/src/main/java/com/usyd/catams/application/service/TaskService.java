package com.usyd.catams.application.service;

import com.usyd.catams.adapter.persistence.TaskMapper;
import com.usyd.catams.adapter.web.dto.DtoMapper;
import com.usyd.catams.adapter.web.dto.TaskDTO;
import com.usyd.catams.domain.model.UnitTask;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskMapper taskMapper;

    public TaskService(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }

    @Transactional
    public TaskDTO createTask(Long unitId, Long typeId, String name) {
        UnitTask task = new UnitTask();
        task.setUnitId(unitId);
        task.setTypeId(typeId);
        task.setName(name);
        taskMapper.insert(task);
        return DtoMapper.toTaskDTO(task);
    }

    public TaskDTO getTask(Long id) {
        UnitTask task = taskMapper.findById(id);
        return DtoMapper.toTaskDTO(task);
    }

    public List<TaskDTO> getTasksByUnit(Long unitId) {
        return taskMapper.findByUnitId(unitId)
                .stream()
                .map(DtoMapper::toTaskDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDTO updateTask(Long id, Long typeId, String name) {
        UnitTask task = taskMapper.findById(id);
        if (task == null) {
            throw new IllegalArgumentException("Task not found");
        }
        task.setTypeId(typeId);
        task.setName(name);
        taskMapper.update(task);
        return DtoMapper.toTaskDTO(task);
    }

    @Transactional
    public void toggleTaskActive(Long id, boolean isActive) {
        taskMapper.updateActive(id, isActive);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskMapper.delete(id);
    }
}