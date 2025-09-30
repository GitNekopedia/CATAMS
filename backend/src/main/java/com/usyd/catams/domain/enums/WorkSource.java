package com.usyd.catams.domain.enums;

/**
 * 工时记录来源枚举
 * - PLANNED: 来自任务预分配
 * - ADHOC:   临时提交（非计划内或代课）
 */
public enum WorkSource {
    PLANNED,
    ADHOC
}
