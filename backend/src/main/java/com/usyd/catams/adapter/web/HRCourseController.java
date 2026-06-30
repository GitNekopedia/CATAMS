package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.CourseUnitDTO;
import com.usyd.catams.application.query.CourseQueryService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * HR 管理课程相关接口
 * 所有接口均经过 AuthInterceptor 拦截，Token 已验证。
 */
@RestController
@RequestMapping("/api/hr/course")
@RequiredArgsConstructor
public class HRCourseController {

    private final CourseQueryService courseQueryService;

    /**
     * 分页查询课程列表
     */
    @GetMapping("/list")
    public ApiResponse<Map<String, Object>> listCourses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) Double minBudget,
            @RequestParam(required = false) Double maxBudget,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortOrder
    ) {
        var result = courseQueryService.listPaged(
                code, name, semester, minBudget, maxBudget,
                startDate, endDate, page, pageSize, sortField, sortOrder
        );
        return ApiResponse.ok(result);
    }

    /**
     * 创建课程
     */
    @PostMapping("/create")
    public ApiResponse<Map<String, Object>> createCourse(@RequestBody CourseUnitDTO dto) {
        Long id = courseQueryService.create(dto);
        return ApiResponse.ok(Map.of("id", id));
    }

    /**
     * 更新课程
     */
    @PutMapping("/update/{id}")
    public ApiResponse<String> updateCourse(@PathVariable Long id, @RequestBody CourseUnitDTO dto) {
        courseQueryService.update(id, dto);
        return ApiResponse.ok("课程更新成功");
    }

    /**
     * 删除课程
     */
    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteCourse(@PathVariable Long id) {
        courseQueryService.delete(id);
        return ApiResponse.ok("删除成功");
    }
}
