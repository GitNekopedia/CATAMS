package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.DetailedWorkEntryDTO;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Tutor 工时记录接口（已由 AuthInterceptor 校验 Token）
 */
@RestController
@RequestMapping("/api/tutor/work-entries")
@RequiredArgsConstructor
public class TutorWorkEntryController {

    private final WorkEntryQueryService workEntryQueryService;

    /**
     * 获取当前 Tutor 的所有工时记录（包含审批信息）
     */
    @GetMapping("/all")
    public ApiResponse<List<DetailedWorkEntryDTO>> listTutorEntries() {
        var user = AuthUserContext.get();
        var entries = workEntryQueryService.getAllTutorDetailedEntries(user.getId());
        return ApiResponse.ok(entries);
    }
}
