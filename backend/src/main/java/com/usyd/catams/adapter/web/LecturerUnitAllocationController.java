package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.TutorOfCourseDTO;
import com.usyd.catams.application.query.CourseQueryService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Lecturer 管理课程与 Tutor 分配相关接口
 * 此模块接口均已由 AuthInterceptor 拦截校验 Token。
 */
@RestController
@RequestMapping("/api/lecturer")
@RequiredArgsConstructor
public class LecturerUnitAllocationController {

    private final CourseQueryService courseQueryService;

    /**
     * 获取指定课程下的 Tutor 列表
     * @param unitId 课程 ID
     */
    @GetMapping("/units/tutors")
    public ApiResponse<List<TutorOfCourseDTO>> getTutorsOfTheCourse(@RequestParam Long unitId) {
        // ✅ Token 已校验，无需重复解析
        // 若需要当前用户（例如校验是否为该课程的 Lecturer），可使用：
        // var user = AuthUserContext.get();

        var tutors = courseQueryService.getTutorsOfTheCourse(unitId);
        return ApiResponse.ok(tutors);
    }
}
