package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.TaskDTO;
import com.usyd.catams.adapter.web.dto.TaskRequest;
import com.usyd.catams.application.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    // Create
    @PostMapping
    public ApiResponse<TaskDTO> create(@RequestBody TaskRequest req) {
        TaskDTO task = service.createTask(req.getUnitId(), req.getTypeId(), req.getName());
        return ApiResponse.ok(task);
    }

    // Read (by ID)
    @GetMapping("/{id}")
    public ApiResponse<TaskDTO> get(@PathVariable Long id) {
        TaskDTO task = service.getTask(id);
        return task != null ? ApiResponse.ok(task) : ApiResponse.fail("Not found");
    }

    // Read (by Unit)
    @GetMapping("/unit/{unitId}")
    public ApiResponse<List<TaskDTO>> getByUnit(@PathVariable Long unitId) {
        return ApiResponse.ok(service.getTasksByUnit(unitId));
    }

    // Update
    @PutMapping("/{id}")
    public ApiResponse<TaskDTO> update(@PathVariable Long id, @RequestBody TaskRequest req) {
        try {
            TaskDTO task = service.updateTask(id, req.getTypeId(), req.getName());
            return ApiResponse.ok(task);
        } catch (IllegalArgumentException e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    // Toggle Active
    @PatchMapping("/{id}/active")
    public ApiResponse<String> toggleActive(@PathVariable Long id, @RequestParam boolean isActive) {
        service.toggleTaskActive(id, isActive);
        return ApiResponse.ok("Updated");
    }

    // Delete
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        service.deleteTask(id);
        return ApiResponse.ok("Deleted");
    }
}
