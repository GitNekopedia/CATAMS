package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.DetailedWorkEntryDTO;
import com.usyd.catams.adapter.web.dto.LoginResponse;

import com.usyd.catams.application.query.WorkEntryQueryService;

import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutor/work-entries")
public class TutorWorkEntryController {

    private final WorkEntryQueryService workEntryQueryService;
    private final AuthTokenService authTokenService;

    public TutorWorkEntryController(WorkEntryQueryService workEntryQueryService, AuthTokenService authTokenService) {
        this.workEntryQueryService = workEntryQueryService;
        this.authTokenService = authTokenService;
    }

    /**
     * 获取某个 Tutor 的所有工时记录（包含审批信息）
     */
    @GetMapping("/all")
    public ApiResponse<List<DetailedWorkEntryDTO>> listTutorEntries(HttpServletRequest request) {
        LoginResponse.UserDTO userDTO = authTokenService.extractUserFromRequest(request);
        Long tutorId = userDTO.getId();
        return ApiResponse.ok(workEntryQueryService.getAllTutorDetailedEntries(tutorId));
    }
}
