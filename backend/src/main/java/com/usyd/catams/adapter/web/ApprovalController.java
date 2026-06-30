package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApproveActionRequest;
import com.usyd.catams.application.command.ApproveWorkEntryHandler;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor

public class ApprovalController {

    private final ApproveWorkEntryHandler approveWorkEntryHandler;

    @PostMapping("/action")
    public ApiResponse<String> handleApproval(@RequestBody @Valid ApproveActionRequest req) {
        var user = AuthUserContext.get(); //
        approveWorkEntryHandler.handle(req, user.getId(), user.getName());
        return ApiResponse.ok("Approval processed successfully");
    }


}
