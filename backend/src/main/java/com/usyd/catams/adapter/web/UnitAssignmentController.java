package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.UnitAssignmentDTO;
import com.usyd.catams.application.service.UnitAssignmentService;
import com.usyd.catams.domain.model.UnitAssignment;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignment")
public class UnitAssignmentController {

    private final UnitAssignmentService service;

    public UnitAssignmentController(UnitAssignmentService service) {
        this.service = service;
    }

    /** 查询课程分配列表（可筛选） */
    @GetMapping("/list")
    public ApiResponse<List<UnitAssignmentDTO>> listAssignments(
            @RequestParam(required = false) Long unitId,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String keyword
    ) {
        var list = service.list(unitId, role, semester, keyword);
        return ApiResponse.ok(list);
    }

    /** 创建课程分配 */
    @PostMapping("/create")
    public ApiResponse<Map<String, Object>> createAssignment(@RequestBody UnitAssignment req) {
        Long id = service.create(req);
        return ApiResponse.ok(Map.of("id", id));
    }

    /** 更新课程分配 */
    @PutMapping("/update/{id}")
    public ApiResponse<String> updateAssignment(@PathVariable Long id, @RequestBody UnitAssignment req) {
        req.setId(id);
        service.update(req);
        return ApiResponse.ok("更新成功");
    }

    /** 删除课程分配 */
    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteAssignment(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok("删除成功");
    }

    /** 按课程查看分配情况 */
    @GetMapping("/course/{courseId}")
    public ApiResponse<List<UnitAssignmentDTO>> getCourseAssignments(@PathVariable Long courseId) {
        var list = service.getByCourse(courseId);
        return ApiResponse.ok(list);
    }
}
