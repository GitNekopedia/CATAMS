package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.ApproveActionRequest;
import com.usyd.catams.application.command.ApproveWorkEntryHandler;
import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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
