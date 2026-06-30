package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.*;
import com.usyd.catams.application.query.WorkEntryQueryService;
import com.usyd.catams.application.service.AuthTokenService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lecturer/work-entries")
@RequiredArgsConstructor
public class LecturerWorkEntryController {

    private final WorkEntryQueryService workEntryQueryService;
    private final AuthTokenService authTokenService;

    /**
     * 获取某个 Tutor 的所有工时记录（包含审批信息）
     */
    @GetMapping("/all")
    public ApiResponse<List<DetailedLecturerPendingWorkEntryDTO>> listLecturerEntries() {
        LoginResponse.UserDTO userDTO = AuthUserContext.get();
        Long lecturerId = userDTO.getId();
        return ApiResponse.ok(workEntryQueryService.getAllLecturerDetailedEntries(lecturerId));
    }
}
