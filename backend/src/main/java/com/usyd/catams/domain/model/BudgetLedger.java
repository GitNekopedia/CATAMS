package com.usyd.catams.domain.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("budget_ledger")
public class BudgetLedger {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long unitId;
    private BigDecimal deltaHours;
    private BigDecimal balance;
    private String refTable;
    private Long refId;
    private String reason;
}
