package com.usyd.catams.infrastructure.exception;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

/**
 * 系统统一响应包装类
 * 用于所有 REST API 返回格式
 */
@Data
@Builder
public class ApiResponse<T> {

    private String code;        // 状态码（如 SYS-000）
    private String message;     // 对应的提示信息
    private T data;             // 实际数据内容
    private String error;       // 错误详情（可为 null）
    private Instant timestamp;  // 响应时间戳


    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
                .code(BusinessCode.SUCCESS.getCode())
                .message(BusinessCode.SUCCESS.getMessage())
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> fail(BusinessCode code, String errorDetail) {
        return ApiResponse.<T>builder()
                .code(code.getCode())
                .message(code.getMessage())
                .error(errorDetail)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> fail(BusinessCode code) {
        return fail(code, null);
    }
}
