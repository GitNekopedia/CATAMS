package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.WorkEntrySubmitRequest;
import com.usyd.catams.application.command.SubmitWorkEntryHandler;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.domain.model.WorkEntry;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/entries")
public class EntryController {
    private final SubmitWorkEntryHandler submitHandler;
    private final WorkEntryQueryService queryService;

    public EntryController(SubmitWorkEntryHandler s, WorkEntryQueryService q){
        this.submitHandler = s; this.queryService = q;
    }

    @PostMapping
    public ApiResponse<Long> submit(@RequestBody @Valid WorkEntrySubmitRequest req){
        return ApiResponse.ok(submitHandler.handle(req));
    }

    @GetMapping
    public ApiResponse<List<WorkEntry>> list(
            @RequestParam Long tutorId,
            @RequestParam LocalDate weekStart){
        return ApiResponse.ok(queryService.listByTutorWeek(tutorId, weekStart));
    }
}
