package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.CourseUnitDTO;
import com.usyd.catams.application.query.CourseQueryService;
import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/hr/course")
public class HRCourseController {

    private final AuthTokenService tokenService;
    private final CourseQueryService courseQueryService;

    public HRCourseController(AuthTokenService tokenService, CourseQueryService courseQueryService) {
        this.tokenService = tokenService;
        this.courseQueryService = courseQueryService;
    }

    @GetMapping("/list")
    public ApiResponse<Map<String, Object>> listCourses(
            HttpServletRequest request,
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
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");
        var result = courseQueryService.listPaged(code, name, semester, minBudget, maxBudget, startDate, endDate, page, pageSize, sortField, sortOrder);
        return ApiResponse.ok(result);
    }

    /** 2️⃣ 创建课程 */
    @PostMapping("/create")
    public ApiResponse<Map<String, Object>> createCourse(@RequestBody CourseUnitDTO dto) {
        try {
            Long id = courseQueryService.create(dto);
            return ApiResponse.ok(Map.of("id", id));
        } catch (Exception e) {
            return ApiResponse.fail("创建课程失败: " + e.getMessage());
        }
    }

    /** 3️⃣ 更新课程 */
    @PutMapping("/update/{id}")
    public ApiResponse<String> updateCourse(@PathVariable Long id, @RequestBody CourseUnitDTO dto) {
        try {
            courseQueryService.update(id, dto);
            return ApiResponse.ok("课程更新成功");
        } catch (Exception e) {
            return ApiResponse.fail("更新失败: " + e.getMessage());
        }
    }

    /** 4️⃣ 删除课程 */
    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteCourse(@PathVariable Long id) {
        try {
            courseQueryService.delete(id);
            return ApiResponse.ok("删除成功");
        } catch (Exception e) {
            return ApiResponse.fail("删除失败: " + e.getMessage());
        }
    }

}
