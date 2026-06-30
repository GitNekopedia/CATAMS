package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.PlannedAllocationDTO;
import com.usyd.catams.application.service.TutorAllocationService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Tutor 查看自己的任务分配接口（已由 AuthInterceptor 校验 Token）
 */
@RestController
@RequestMapping("/api/allocations/tutor")
@RequiredArgsConstructor
public class TutorAllocationController {

    private final TutorAllocationService tutorAllocationService;

    /**
     * Tutor 查看自己的任务分配
     */
    @GetMapping
    public ApiResponse<List<PlannedAllocationDTO>> getMyAllocations(
            @RequestParam(required = false) Long unitId,
            @RequestParam(required = false) Long tutorId
    ) {
        var user = AuthUserContext.get(); // ✅ 当前登录用户（Tutor 或 HR）

        // ✅ 如果传了 tutorId，则按 tutorId 查，否则查当前用户
        Long targetTutorId = (tutorId != null) ? tutorId : user.getId();

        var result = tutorAllocationService.getAllocationsByTutor(targetTutorId, unitId);
        return ApiResponse.ok(result);
    }
}
