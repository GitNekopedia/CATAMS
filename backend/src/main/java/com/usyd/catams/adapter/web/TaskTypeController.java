package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.TaskTypeDTO;
import com.usyd.catams.adapter.web.dto.TaskTypeRequest;
import com.usyd.catams.application.service.TaskTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-types")
public class TaskTypeController {

    private final TaskTypeService taskTypeService;

    public TaskTypeController(TaskTypeService taskTypeService) {
        this.taskTypeService = taskTypeService;
    }

    // Create
    @PostMapping
    public ApiResponse<TaskTypeDTO> create(@RequestBody TaskTypeRequest req) {
        try {
            TaskTypeDTO type = taskTypeService.createTaskType(req.getUnitId(), req.getName());
            return ApiResponse.ok(type);
        } catch (IllegalArgumentException e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    // Read (by ID)
    @GetMapping("/{id}")
    public ApiResponse<TaskTypeDTO> get(@PathVariable Long id) {
        TaskTypeDTO type = taskTypeService.getTaskType(id);
        return type != null ? ApiResponse.ok(type) : ApiResponse.fail("Not found");
    }

    // Read (by Unit)
    @GetMapping("/unit/{unitId}")
    public ApiResponse<List<TaskTypeDTO>> getByUnit(@PathVariable Long unitId) {
        return ApiResponse.ok(taskTypeService.getTaskTypesByUnit(unitId));
    }

    // Update
    @PutMapping("/{id}")
    public ApiResponse<TaskTypeDTO> update(@PathVariable Long id, @RequestBody TaskTypeRequest req) {
        try {
            TaskTypeDTO type = taskTypeService.updateTaskType(id, req.getName());
            return ApiResponse.ok(type);
        } catch (IllegalArgumentException e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        try {
            taskTypeService.deleteTaskType(id);
            return ApiResponse.ok("Deleted");
        } catch (IllegalArgumentException e) {
            return ApiResponse.fail(e.getMessage());
        }
    }
}
