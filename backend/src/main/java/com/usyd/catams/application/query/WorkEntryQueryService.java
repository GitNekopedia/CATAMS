package com.usyd.catams.application.query;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.domain.model.WorkEntry;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WorkEntryQueryService {
    private final WorkEntryMapper mapper;
    public WorkEntryQueryService(WorkEntryMapper mapper){ this.mapper = mapper; }

    public List<WorkEntry> listByTutorWeek(Long tutorId, LocalDate weekStart) {
        return mapper.selectList(new LambdaQueryWrapper<WorkEntry>()
                .eq(WorkEntry::getTutorId, tutorId)
                .eq(WorkEntry::getWeekStart, weekStart));
    }
}
