package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.HrOverviewDTO;
import com.usyd.catams.application.query.HrDashboardQueryService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hr/dashboard")
@RequiredArgsConstructor
public class HrDashboardController {

    private final HrDashboardQueryService hrDashboardQueryService;

    @GetMapping("/overview")
    public ApiResponse<HrOverviewDTO> getOverview() {
        HrOverviewDTO dto = hrDashboardQueryService.getOverview();
        return ApiResponse.ok(dto);
    }
}
