package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.AllocationRequest;
import com.usyd.catams.adapter.web.dto.AllocationResponse;
import com.usyd.catams.application.service.PlannedTaskAllocationService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Lecturer 管理任务分配（Allocations）接口
 * 已经由 AuthInterceptor 拦截校验 Token。
 */
@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
public class TaskAllocationController {

    private final PlannedTaskAllocationService allocationService;

    /**
     * 查询某个 unit 下的所有任务分配
     */
    @GetMapping
    public ApiResponse<List<AllocationResponse>> listAllocations(@RequestParam Long unitId) {
        var allocations = allocationService.listAllocationsByUnit(unitId);
        return ApiResponse.ok(allocations);
    }

    /**
     * 批量保存 Tutor 的任务分配
     */
    @PostMapping
    public ApiResponse<String> saveAllocations(@RequestBody AllocationRequest req) {
        var user = AuthUserContext.get(); // ✅ 当前登录 Lecturer
        allocationService.saveTutorAllocations(
                req.getUnitId(),
                req.getTutorId(),
                req.getAllocations(),
                user.getId()
        );
        return ApiResponse.ok("success");
    }

    /**
     * 更新单条任务分配的计划工时
     */
    @PutMapping("/{id}")
    public ApiResponse<String> updateAllocation(@PathVariable Long id,
                                                @RequestParam double plannedHours) {
        var user = AuthUserContext.get();
        allocationService.updateAllocationHours(id, plannedHours, user.getId());
        return ApiResponse.ok("success");
    }

    /**
     * 删除单条任务分配
     */
    @DeleteMapping
    public ApiResponse<String> deleteByTutorAndTask(@RequestParam Long tutorId,
                                                    @RequestParam Long taskId) {
        allocationService.deleteByTutorAndTask(tutorId, taskId);
        return ApiResponse.ok("success");
    }
}
