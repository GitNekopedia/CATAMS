package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.*;
import com.usyd.catams.application.query.CourseQueryService;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.application.service.LecturerDashBoardService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Lecturer 个人工作台接口
 * 已由 AuthInterceptor 校验 Token。
 */
@RestController
@RequestMapping("/api/lecturer")
@RequiredArgsConstructor
public class LecturerDashboardController {

    private final CourseQueryService courseQueryService;
    private final WorkEntryQueryService workEntryQueryService;
    private final LecturerDashBoardService lecturerDashboardService;

    /**
     * 获取讲师的课程列表
     */
    @GetMapping("/courses")
    public ApiResponse<List<LecturerCourseDTO>> getLecturerCourses() {
        var user = AuthUserContext.get(); // ✅ 拿当前登录讲师
        var courses = courseQueryService.findLecturerCourses(user.getId());
        return ApiResponse.ok(courses);
    }

    /**
     * 获取讲师最近的工时记录
     */
    @GetMapping("/recent-entries")
    public ApiResponse<List<LecturerPendingWorkEntryDTO>> getRecentWorkEntries(
            @RequestParam(defaultValue = "5") int limit
    ) {
        var user = AuthUserContext.get();
        var entries = workEntryQueryService.listRecentByLecturer(user.getId(), limit);
        return ApiResponse.ok(entries);
    }

    /**
     * 获取讲师仪表盘总体数据
     */
    @GetMapping("/overview")
    public ApiResponse<LecturerOverviewDTO> getStats() {
        var user = AuthUserContext.get();
        var overview = lecturerDashboardService.getLecturerOverview(user.getId());
        return ApiResponse.ok(overview);
    }
}
