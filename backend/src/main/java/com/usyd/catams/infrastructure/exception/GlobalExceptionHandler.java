package com.usyd.catams.infrastructure.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 捕获所有业务异常（继承自 BusinessException）
     */
    @ExceptionHandler(BusinessException.class)
    public ApiResponse<?> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        log.warn("Business exception [{}] at {}: {}",
                ex.getCode().getCode(), request.getRequestURI(), ex.getMessage());
        return ApiResponse.fail(ex.getCode(), ex.getMessage());
    }

    /**
     * 捕获未预期的系统异常
     */
    @ExceptionHandler(Exception.class)
    public ApiResponse<?> handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error at [{}]: {}", request.getRequestURI(), ex.getMessage(), ex);
        return ApiResponse.fail(BusinessCode.INTERNAL_ERROR, ex.getMessage());
    }
}
