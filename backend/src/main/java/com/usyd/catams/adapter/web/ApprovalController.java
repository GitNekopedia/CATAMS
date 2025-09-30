package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.persistence.ApprovalTaskMapper;
import com.usyd.catams.adapter.persistence.UnitAssignmentMapper;
import com.usyd.catams.adapter.persistence.UserMapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.ApproveActionRequest;
import com.usyd.catams.adapter.web.dto.LoginResponse;
import com.usyd.catams.adapter.web.dto.WorkEntryDTO;
import com.usyd.catams.application.command.ApproveWorkEntryHandler;
import com.usyd.catams.application.service.AuthTokenService;
import com.usyd.catams.application.service.WorkEntryApprovalService;
import com.usyd.catams.domain.model.UserEntity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final AuthTokenService authTokenService;
    private final ApproveWorkEntryHandler approveWorkEntryHandler;

    public ApprovalController(AuthTokenService authTokenService, ApproveWorkEntryHandler approveWorkEntryHandler) {
        this.authTokenService = authTokenService;
        this.approveWorkEntryHandler = approveWorkEntryHandler;
    }

    @PostMapping("/action")
    public ApiResponse<String> handleApproval(
            @RequestBody @Valid ApproveActionRequest req,
            HttpServletRequest request) {

        var user = authTokenService.extractUserFromRequest(request);
        approveWorkEntryHandler.handle(req, user.getId(), user.getName());
        return ApiResponse.ok("审批操作成功");
    }


}
