package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.PlannedAllocationDTO;
import com.usyd.catams.application.service.AuthTokenService;
import com.usyd.catams.application.service.TutorAllocationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/allocations/tutor")
public class TutorAllocationController {
    private final AuthTokenService authTokenService;
    private final TutorAllocationService tutorAllocationService;

    public TutorAllocationController(AuthTokenService authTokenService, TutorAllocationService tutorAllocationService) {
        this.authTokenService = authTokenService;
        this.tutorAllocationService = tutorAllocationService;
    }

    // Tutor 查看自己的所有分配
    @GetMapping
    public ApiResponse<List<PlannedAllocationDTO>> getMyAllocations(
            HttpServletRequest request,
            @RequestParam(required = false) Long unitId
    ) {
        var user = authTokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");

        List<PlannedAllocationDTO> result = tutorAllocationService.getAllocationsByTutor(user.getId(), unitId);
        return ApiResponse.ok(result);
    }
}
