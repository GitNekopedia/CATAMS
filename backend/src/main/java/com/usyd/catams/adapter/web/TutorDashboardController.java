// 文件位置：com.usyd.catams.adapter.web.TutorDashboardController
package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.persistence.CourseUnitMapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.StatData;
import com.usyd.catams.domain.model.CourseUnit;
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

    public TutorDashboardController(AuthTokenService tokenService,
                                    CourseUnitMapper courseUnitMapper,
                                    WorkEntryMapper workEntryMapper) {
        this.tokenService = tokenService;
        this.courseUnitMapper = courseUnitMapper;
        this.workEntryMapper = workEntryMapper;
    }

    @GetMapping("/courses")
    public ApiResponse<List<CourseUnit>> getTutorCourses(HttpServletRequest request) {
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");
        return ApiResponse.ok(courseUnitMapper.findByTutorId(user.getId()));
    }

    @GetMapping("/entries")
    public ApiResponse<List<WorkEntry>> getRecentWorkEntries(HttpServletRequest request) {
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");
        return ApiResponse.ok(workEntryMapper.findRecentByTutorId(user.getId()));
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
