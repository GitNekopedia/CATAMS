package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.DetailedLecturerPendingWorkEntryDTO;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/hr/work-entries")
public class HRWorkEntryController {

    private final AuthTokenService authTokenService;
    private final WorkEntryQueryService workEntryQueryService;

    @GetMapping("/all")
    public ApiResponse<List<DetailedLecturerPendingWorkEntryDTO>> listAllEntries(HttpServletRequest request) {
        var user = authTokenService.extractUserFromRequest(request);
        if (user == null) return ApiResponse.fail("Unauthorized");
        return ApiResponse.ok(workEntryQueryService.getAllHRDetailedEntries(user.getId()));
    }
}
