package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.AllocationRequest;
import com.usyd.catams.adapter.web.dto.AllocationResponse;
import com.usyd.catams.adapter.web.dto.LoginResponse;
import com.usyd.catams.application.service.AuthTokenService;
import com.usyd.catams.application.service.PlannedTaskAllocationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
public class TaskAllocationController {
    private final AuthTokenService tokenService;
    private final PlannedTaskAllocationService allocationService;

    public TaskAllocationController(AuthTokenService tokenService,
                                    PlannedTaskAllocationService allocationService) {
        this.tokenService = tokenService;
        this.allocationService = allocationService;
    }

    /**
     * 查询某个 unit 下的所有任务分配
     */
    @GetMapping
    public ApiResponse<List<AllocationResponse>> listAllocations(HttpServletRequest request,
                                                                 @RequestParam Long unitId) {

        LoginResponse.UserDTO user = tokenService.extractUserFromRequest(request);

        if (user == null) return ApiResponse.fail("Unauthorized");


        return ApiResponse.ok(allocationService.listAllocationsByUnit(unitId));
    }

    /**
     * 保存某个 tutor 的 allocations（批量提交）
     */
    @PostMapping
    public ApiResponse<String> saveAllocations(HttpServletRequest request,
                                               @RequestBody AllocationRequest req) {

        LoginResponse.UserDTO user = tokenService.extractUserFromRequest(request);

        if (user == null) return ApiResponse.fail("Unauthorized");


        allocationService.saveTutorAllocations(
                req.getUnitId(),
                req.getTutorId(),
                req.getAllocations(),
                user.getId()
        );
        return ApiResponse.ok("success");
    }

    /**
     * 更新单条分配的工时
     */
    @PutMapping("/{id}")
    public ApiResponse<String> updateAllocation(HttpServletRequest request,
                                                @PathVariable Long id,
                                                @RequestParam double plannedHours) {

        LoginResponse.UserDTO user = tokenService.extractUserFromRequest(request);

        if (user == null) return ApiResponse.fail("Unauthorized");


        allocationService.updateAllocationHours(id, plannedHours, user.getId());
        return ApiResponse.ok("success");
    }

    /**
     * 删除单条分配
     */
    @DeleteMapping()
    public ApiResponse<String> deleteByTutorAndTask(HttpServletRequest request,
                                                    @RequestParam Long tutorId,
                                                    @RequestParam Long taskId) {

        LoginResponse.UserDTO user = tokenService.extractUserFromRequest(request);

        if (user == null) return ApiResponse.fail("Unauthorized");


        allocationService.deleteByTutorAndTask(tutorId, taskId);
        return ApiResponse.ok("Success");
    }
}
