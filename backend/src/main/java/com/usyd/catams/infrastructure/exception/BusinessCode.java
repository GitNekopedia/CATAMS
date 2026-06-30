package com.usyd.catams.infrastructure.exception;

import lombok.Getter;

/**
 * 系统统一业务状态码定义
 * 格式：模块前缀 + 三位数字，如：
 * SYS-000 成功；USR-001 未授权；WKE-002 重复提交
 */
@Getter
public enum BusinessCode {

    // ======== 通用系统 ========
    SUCCESS("SYS-000", "Success"),
    BAD_REQUEST("SYS-001", "Bad request"),
    INTERNAL_ERROR("SYS-002", "Internal server error"),

    // ======== 用户与权限 ========
    UNAUTHORIZED("USR-001", "Unauthorized or token expired"),
    FORBIDDEN("USR-002", "Access denied"),
    USER_NOT_FOUND("USR-003", "User not found"),

    // ======== 课程模块 ========
    COURSE_NOT_FOUND("CRS-001", "Course not found"),
    COURSE_BUDGET_EXCEEDED("CRS-002", "Course budget exceeded"),

    // ======== 工时模块 ========
    WORK_ENTRY_INVALID("WKE-001", "Invalid work entry"),
    WORK_ENTRY_DUPLICATE("WKE-002", "Duplicate work entry"),
    WORK_ENTRY_NOT_FOUND("WKE-003", "Work entry not found"),

    // ======== 审批模块 ========
    APPROVAL_STEP_INVALID("APP-001", "Invalid approval step"),
    APPROVAL_ALREADY_DONE("APP-002", "Approval already completed"),

    // ======== 心情模块 ========
    MOOD_TYPE_INVALID("MDD-001", "Invalid mood type");

    private final String code;
    private final String message;

    BusinessCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
