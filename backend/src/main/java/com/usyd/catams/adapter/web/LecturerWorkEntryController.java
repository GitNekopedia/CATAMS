package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.*;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lecturer/work-entries")
public class LecturerWorkEntryController {

    private final WorkEntryQueryService workEntryQueryService;
    private final AuthTokenService authTokenService;

    public LecturerWorkEntryController(WorkEntryQueryService workEntryQueryService, AuthTokenService authTokenService) {
        this.workEntryQueryService = workEntryQueryService;
        this.authTokenService = authTokenService;
    }

    /**
     * 获取某个 Tutor 的所有工时记录（包含审批信息）
     */
    @GetMapping("/all")
    public ApiResponse<List<DetailedLecturerPendingWorkEntryDTO>> listLecturerEntries(HttpServletRequest request) {
        LoginResponse.UserDTO userDTO = authTokenService.extractUserFromRequest(request);
        Long lecturerId = userDTO.getId();
        return ApiResponse.ok(workEntryQueryService.getAllLecturerDetailedEntries(lecturerId));
    }
}
