package com.usyd.catams.infrastructure.exception;

import lombok.Getter;

/**
 * 系统业务异常基类
 * 所有可预期的业务异常都应继承此类
 */
@Getter
public class BusinessException extends RuntimeException {

    private final BusinessCode code;

    public BusinessException(BusinessCode code) {
        super(code.getMessage());
        this.code = code;
    }

    public BusinessException(BusinessCode code, String detailMessage) {
        super(detailMessage);
        this.code = code;
    }
}
