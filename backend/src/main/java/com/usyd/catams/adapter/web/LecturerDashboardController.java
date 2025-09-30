package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.persistence.CourseUnitMapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.adapter.web.dto.*;
import com.usyd.catams.application.query.CourseQueryService;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lecturer")
public class LecturerDashboardController {

    private final AuthTokenService tokenService;
    private final CourseUnitMapper courseUnitMapper;
    private final WorkEntryMapper workEntryMapper;
    private final CourseQueryService courseQueryService;
    private final WorkEntryQueryService workEntryQueryService;

    public LecturerDashboardController(AuthTokenService tokenService,
                                       CourseUnitMapper courseUnitMapper,
                                       WorkEntryMapper workEntryMapper,
                                       CourseQueryService courseQueryService,
                                       WorkEntryQueryService workEntryQueryService) {
        this.tokenService = tokenService;
        this.courseUnitMapper = courseUnitMapper;
        this.workEntryMapper = workEntryMapper;
        this.courseQueryService = courseQueryService;
        this.workEntryQueryService = workEntryQueryService;
    }

    @GetMapping("/courses")
    public ApiResponse<List<LecturerCourseDTO>> getLecturerCourses(HttpServletRequest request) {
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");
        return ApiResponse.ok(courseQueryService.findLecturerCourses(user.getId()));
    }

    @GetMapping("/entries")
    public ApiResponse<List<LecturerPendingWorkEntryDTO>> getRecentWorkEntries(HttpServletRequest request,
                                                                @RequestParam(defaultValue = "10") int limit
    ) {
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");
        try {
            List<LecturerPendingWorkEntryDTO> list = workEntryQueryService.listRecentByLecturer(user.getId(), limit);
            return ApiResponse.ok(list);
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ApiResponse<StatData> getStats(HttpServletRequest request) {
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");

        int workCount = workEntryMapper.countByLecturerId(user.getId());
        double remainingBudget = courseUnitMapper.totalRemainingBudget(user.getId());
        // double approvalProgress = workEntryMapper.approvalProgress(user.getId());

        return ApiResponse.ok(new StatData(workCount, remainingBudget, 1));
    }


}
