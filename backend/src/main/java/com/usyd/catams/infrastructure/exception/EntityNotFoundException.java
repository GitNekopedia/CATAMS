package com.usyd.catams.infrastructure.exception;

/**
 * 用于表示实体未找到的异常，例如 Tutor/Course/WorkEntry 不存在
 */
public class EntityNotFoundException extends BusinessException {

    public EntityNotFoundException(String detailMessage) {
        super(BusinessCode.COURSE_NOT_FOUND, detailMessage);
    }
}
