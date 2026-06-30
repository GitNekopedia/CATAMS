// 文件位置：com.usyd.catams.adapter.web.TutorDashboardController
package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.*;
import com.usyd.catams.application.query.CourseQueryService;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.application.service.TutorDashboardService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Tutor 工作台接口（已由 AuthInterceptor 校验 Token）
 */
@RestController
@RequestMapping("/api/tutor")
@RequiredArgsConstructor
public class TutorDashboardController {

    private final CourseQueryService courseQueryService;
    private final WorkEntryQueryService workEntryQueryService;
    private final TutorDashboardService tutorDashboardService;

    /**
     * 获取 Tutor 的课程列表
     */
    @GetMapping("/courses")
    public ApiResponse<List<TutorCourseDTO>> getTutorCourses() {
        var user = AuthUserContext.get();
        var courses = courseQueryService.findTutorCourses(user.getId());
        return ApiResponse.ok(courses);
    }

    /**
     * 获取 Tutor 最近的工时记录
     */
    @GetMapping("/entries")
    public ApiResponse<List<WorkEntryDTO>> getRecentWorkEntries(
            @RequestParam(defaultValue = "5") int limit
    ) {
        var user = AuthUserContext.get();
        var entries = workEntryQueryService.listRecentByTutor(user.getId(), limit);
        return ApiResponse.ok(entries);
    }

    /**
     * 获取 Tutor 仪表盘总览数据
     */
    @GetMapping("/overview")
    public ApiResponse<TutorOverviewDTO> getStats() {
        var user = AuthUserContext.get();
        var overview = tutorDashboardService.getTutorOverview(user.getId());
        return ApiResponse.ok(overview);
    }
}
