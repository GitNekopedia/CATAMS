// 文件位置：com.usyd.catams.adapter.web.TutorDashboardController
package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.persistence.CourseUnitMapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.adapter.web.dto.*;
import com.usyd.catams.application.query.CourseQueryService;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.domain.model.UnitAssignment;
import com.usyd.catams.domain.model.WorkEntry;
import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutor")
public class TutorDashboardController {

    private final AuthTokenService tokenService;
    private final CourseUnitMapper courseUnitMapper;
    private final WorkEntryMapper workEntryMapper;
    private final CourseQueryService courseQueryService;
    private final WorkEntryQueryService workEntryQueryService;

    public TutorDashboardController(AuthTokenService tokenService,
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
    public ApiResponse<List<TutorCourseDTO>> getTutorCourses(HttpServletRequest request) {
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");
        return ApiResponse.ok(courseQueryService.findTutorCourses(user.getId()));
    }

    @GetMapping("/entries")
    public ApiResponse<List<WorkEntryDTO>> getRecentWorkEntries(HttpServletRequest request,
                                                                @RequestParam(defaultValue = "10") int limit
    ) {
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");
        try {
            var list = workEntryQueryService.listRecentByTutor(user.getId(), limit);
            return ApiResponse.ok(list);
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ApiResponse<StatData> getStats(HttpServletRequest request) {
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");

        int workCount = workEntryMapper.countByTutorId(user.getId());
        double remainingBudget = courseUnitMapper.totalRemainingBudget(user.getId());
        double approvalProgress = workEntryMapper.approvalProgress(user.getId());

        return ApiResponse.ok(new StatData(workCount, remainingBudget, approvalProgress));
    }


}
