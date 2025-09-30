package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.WorkEntrySubmitRequest;
import com.usyd.catams.application.command.SubmitWorkEntryHandler;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.application.service.AuthTokenService;
import com.usyd.catams.domain.model.WorkEntry;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/work-entry")

public class EntryController {
    private final SubmitWorkEntryHandler submitHandler;
    private final WorkEntryQueryService queryService;
    private final AuthTokenService tokenService;

    public EntryController(SubmitWorkEntryHandler submitHandler, WorkEntryQueryService queryService, AuthTokenService tokenService){
        this.submitHandler = submitHandler;
        this.queryService = queryService;
        this.tokenService = tokenService;
    }

    @PostMapping("/submit")
    public ApiResponse<Long> submit(HttpServletRequest request, @RequestBody @Valid WorkEntrySubmitRequest req){
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) {
            return ApiResponse.fail("Unauthorized");
        }
        return ApiResponse.ok(submitHandler.handle(user.getId(), req));
    }

    @GetMapping
    public ApiResponse<List<WorkEntry>> list(
            @RequestParam Long tutorId,
            @RequestParam LocalDate weekStart){
        return ApiResponse.ok(queryService.listByTutorWeek(tutorId, weekStart));
    }

}
