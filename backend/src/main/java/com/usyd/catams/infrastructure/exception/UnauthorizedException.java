package com.usyd.catams.infrastructure.exception;

/**
 * 用于鉴权失败或访问未授权的异常
 */
public class UnauthorizedException extends BusinessException {

    public UnauthorizedException(String detailMessage) {
        super(BusinessCode.UNAUTHORIZED, detailMessage);
    }
}
