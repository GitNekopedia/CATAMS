package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.DetailedLecturerPendingWorkEntryDTO;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * HR 查询所有工时记录（含审批状态）
 * 此接口已被 AuthInterceptor 拦截，Token 已校验。
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/hr/work-entries")
public class HRWorkEntryController {

    private final WorkEntryQueryService workEntryQueryService;

    /**
     * 获取所有工时记录（包含审批详情）
     */
    @GetMapping("/all")
    public ApiResponse<List<DetailedLecturerPendingWorkEntryDTO>> listAllEntries() {
        var user = AuthUserContext.get();
        var result = workEntryQueryService.getAllHRDetailedEntries(user.getId());
        return ApiResponse.ok(result);
    }
}
