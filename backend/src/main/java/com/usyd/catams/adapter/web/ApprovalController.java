package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.ApproveActionRequest;
import com.usyd.catams.application.command.ApproveWorkEntryHandler;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/approvals")
public class ApprovalController {
    private final ApproveWorkEntryHandler handler;
    public ApprovalController(ApproveWorkEntryHandler h){ this.handler = h; }

    @PostMapping("/actions")
    public ApiResponse<Void> approve(@RequestBody @Valid ApproveActionRequest req){
        Long mockOperatorId = 1L; // TODO: 从登录用户上下文取
        handler.handle(req, mockOperatorId);
        return ApiResponse.ok(null);
    }
}
