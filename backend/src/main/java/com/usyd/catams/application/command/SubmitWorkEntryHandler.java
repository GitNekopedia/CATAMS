package com.usyd.catams.application.command;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.adapter.web.dto.WorkEntrySubmitRequest;
import com.usyd.catams.domain.enums.WorkStatus;
import com.usyd.catams.domain.model.WorkEntry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class SubmitWorkEntryHandler {
    private final WorkEntryMapper workEntryMapper;
    public SubmitWorkEntryHandler(WorkEntryMapper mapper){ this.workEntryMapper = mapper; }

    @Transactional
    public Long handle(WorkEntrySubmitRequest req) {
        // 业务校验（示例）：同 tutor/unit/weekStart 不可重复
        var exists = workEntryMapper.selectCount(new LambdaQueryWrapper<WorkEntry>()
                .eq(WorkEntry::getTutorId, req.tutorId())
                .eq(WorkEntry::getUnitId, req.unitId())
                .eq(WorkEntry::getWeekStart, req.weekStart())) > 0;
        if (exists) throw new IllegalStateException("该周已存在工时记录");

        // payRateSnapshot 实际应来自 tutor_assignment，此处先用占位
        var entry = new WorkEntry();
        entry.setTutorId(req.tutorId());
        entry.setUnitId(req.unitId());
        entry.setWeekStart(req.weekStart());
        entry.setWorkType(req.workType());
        entry.setDescription(req.description());
        entry.setHours(req.hours());
        entry.setPayRateSnapshot(new BigDecimal("50.00")); // TODO: 查询 tutor_assignment
        entry.setStatus(WorkStatus.SUBMITTED);
        entry.setVersion(0);

        workEntryMapper.insert(entry);
        // TODO: 预算预占（Redis/Lua + 记 budget_ledger），缓存失效
        return entry.getId();
    }
}
