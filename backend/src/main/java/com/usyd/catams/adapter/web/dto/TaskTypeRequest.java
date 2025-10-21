package com.usyd.catams.adapter.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;


@Data
public class TaskTypeRequest {
    private Long unitId;   // 课程ID
    private String name;   // 类型名，例如 "Tutorial"
    @JsonProperty("phd_pay_rate")
    private BigDecimal phdPayRate;

    @JsonProperty("non_phd_pay_rate")
    private BigDecimal nonPhdPayRate;
}
