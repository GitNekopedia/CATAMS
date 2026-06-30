package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.WorkEntrySubmitRequest;
import com.usyd.catams.application.command.SubmitWorkEntryHandler;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.exception.UnauthorizedException;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import com.usyd.catams.domain.model.WorkEntry;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 工时记录控制器
 * Tutor 可提交工时、查询自己工时记录
 */
@RestController
@RequestMapping("/api/work-entry")
@RequiredArgsConstructor

public class EntryController {

    private final SubmitWorkEntryHandler submitHandler;
    private final WorkEntryQueryService queryService;


    /**
     * Tutor 提交工时记录
     */
    @PostMapping("/submit")
    public ApiResponse<Long> submit(@RequestBody @Valid WorkEntrySubmitRequest req) {
        // ✅ 从统一上下文中获取当前登录用户
        var user = AuthUserContext.get();

        Long entryId = submitHandler.handle(user.getId(), req);
        return ApiResponse.ok(entryId);
    }

    /**
     * 查询某 Tutor 某周的工时记录
     */
    @GetMapping
    public ApiResponse<List<WorkEntry>> list(
            @RequestParam Long tutorId,
            @RequestParam LocalDate weekStart) {

        var entries = queryService.listByTutorWeek(tutorId, weekStart);
        return ApiResponse.ok(entries);
    }
}
