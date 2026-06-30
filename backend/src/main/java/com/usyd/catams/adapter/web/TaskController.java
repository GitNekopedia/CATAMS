package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.TaskDTO;
import com.usyd.catams.adapter.web.dto.TaskRequest;
import com.usyd.catams.application.service.TaskService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 任务管理接口（已由 AuthInterceptor 拦截 Token）
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService service;

    /**
     * 创建任务
     */
    @PostMapping
    public ApiResponse<TaskDTO> create(@RequestBody TaskRequest req) {
        var task = service.createTask(req.getUnitId(), req.getTypeId(), req.getName());
        return ApiResponse.ok(task);
    }

    /**
     * 根据 ID 查询任务
     */
    @GetMapping("/{id}")
    public ApiResponse<TaskDTO> get(@PathVariable Long id) {
        var task = service.getTask(id);
        if (task == null) {
            throw new IllegalArgumentException("Task not found with id: " + id);
        }
        return ApiResponse.ok(task);
    }

    /**
     * 根据课程查询任务列表
     */
    @GetMapping("/unit/{unitId}")
    public ApiResponse<List<TaskDTO>> getByUnit(@PathVariable Long unitId) {
        var tasks = service.getTasksByUnit(unitId);
        return ApiResponse.ok(tasks);
    }

    /**
     * 更新任务
     */
    @PutMapping("/{id}")
    public ApiResponse<TaskDTO> update(@PathVariable Long id, @RequestBody TaskRequest req) {
        var updated = service.updateTask(id, req.getTypeId(), req.getName());
        return ApiResponse.ok(updated);
    }

    /**
     * 切换任务启用状态
     */
    @PatchMapping("/{id}/active")
    public ApiResponse<String> toggleActive(@PathVariable Long id, @RequestParam boolean isActive) {
        service.toggleTaskActive(id, isActive);
        return ApiResponse.ok("Updated");
    }

    /**
     * 删除任务
     */
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        service.deleteTask(id);
        return ApiResponse.ok("Deleted");
    }
}
