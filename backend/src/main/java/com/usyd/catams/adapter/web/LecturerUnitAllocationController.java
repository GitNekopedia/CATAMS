package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.LoginResponse;
import com.usyd.catams.adapter.web.dto.TutorOfCourseDTO;
import com.usyd.catams.application.query.CourseQueryService;
import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lecturer")
public class LecturerUnitAllocationController {
    private final AuthTokenService tokenService;
    private final CourseQueryService courseQueryService;

    public LecturerUnitAllocationController(AuthTokenService tokenService, CourseQueryService courseQueryService) {
        this.tokenService = tokenService;
        this.courseQueryService = courseQueryService;
    }

    @GetMapping("/units/tutors")
    public ApiResponse<List<TutorOfCourseDTO>> getTutorsOfTheCourse(HttpServletRequest request, Long unitId){
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");
        return ApiResponse.ok(courseQueryService.getTutorsOfTheCourse(unitId));
    }


}
