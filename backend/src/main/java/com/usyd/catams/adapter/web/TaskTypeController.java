package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.TaskTypeDTO;
import com.usyd.catams.adapter.web.dto.TaskTypeRequest;
import com.usyd.catams.application.service.TaskTypeService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 任务类型管理接口（已由 AuthInterceptor 拦截 Token）
 */
@RestController
@RequestMapping("/api/task-types")
@RequiredArgsConstructor
public class TaskTypeController {

    private final TaskTypeService taskTypeService;

    /**
     * 创建任务类型
     */
    @PostMapping
    public ApiResponse<TaskTypeDTO> create(@RequestBody TaskTypeRequest req) {
        var type = taskTypeService.createTaskType(
                req.getUnitId(),
                req.getName(),
                req.getPhdPayRate(),
                req.getNonPhdPayRate()
        );
        return ApiResponse.ok(type);
    }

    /**
     * 根据 ID 查询任务类型
     */
    @GetMapping("/{id}")
    public ApiResponse<TaskTypeDTO> get(@PathVariable Long id) {
        var type = taskTypeService.getTaskType(id);
        if (type == null) {
            throw new IllegalArgumentException("Task type not found with id: " + id);
        }
        return ApiResponse.ok(type);
    }

    /**
     * 根据课程查询任务类型列表
     */
    @GetMapping("/unit/{unitId}")
    public ApiResponse<List<TaskTypeDTO>> getByUnit(@PathVariable Long unitId) {
        var types = taskTypeService.getTaskTypesByUnit(unitId);
        return ApiResponse.ok(types);
    }

    /**
     * 更新任务类型
     */
    @PutMapping("/{id}")
    public ApiResponse<TaskTypeDTO> update(@PathVariable Long id, @RequestBody TaskTypeRequest req) {
        var updated = taskTypeService.updateTaskType(id, req.getName());
        return ApiResponse.ok(updated);
    }

    /**
     * 删除任务类型
     */
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        taskTypeService.deleteTaskType(id);
        return ApiResponse.ok("Deleted");
    }
}
