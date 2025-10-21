package com.usyd.catams.application.service.impl;

import com.usyd.catams.adapter.persistence.CourseUnitMapper;
import com.usyd.catams.adapter.web.dto.AllocationResponse;
import com.usyd.catams.adapter.web.dto.WeekHoursDTO;
import com.usyd.catams.application.service.NotificationService;
import com.usyd.catams.application.service.PlannedTaskAllocationService;
import com.usyd.catams.adapter.persistence.PlannedTaskAllocationMapper;
import com.usyd.catams.domain.model.PlannedTaskAllocationRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PlannedTaskAllocationServiceImpl implements PlannedTaskAllocationService {

    private final PlannedTaskAllocationMapper plannedTaskAllocationMapper;
    private final CourseUnitMapper courseUnitMapper;
    private final NotificationService notificationService;

    public PlannedTaskAllocationServiceImpl(PlannedTaskAllocationMapper plannedTaskAllocationMapper,
                                            CourseUnitMapper courseUnitMapper,
                                            NotificationService notificationService) {
        this.plannedTaskAllocationMapper = plannedTaskAllocationMapper;
        this.courseUnitMapper = courseUnitMapper;
        this.notificationService = notificationService;
    }

    @Override
    public List<AllocationResponse> listAllocationsByUnit(Long unitId) {
        return plannedTaskAllocationMapper.findByUnitId(unitId);
    }

    @Transactional
    @Override
    public void saveTutorAllocations(Long unitId, Long tutorId,
                                     List<WeekHoursDTO> allocations,
                                     Long createdBy) {
        // 这里要做：
        // 1. 根据 unitId 查课程 startDate
        // 2. 把 Week1..Week12 转成具体 week_start 日期
        // 3. 保存到 planned_task_allocation 表（批量 upsert）

        // 1. 根据 unitId 拿到 start_date
        LocalDate startDate = courseUnitMapper.findStartDateByUnitId(unitId);

        // 2. 把 Week1..Week12 转成实际日期
        List<PlannedTaskAllocationRecord> records = new ArrayList<>();
        for (WeekHoursDTO dto : allocations) {
            for (Map.Entry<String, Double> entry : dto.getWeekHours().entrySet()) {
                String weekKey = entry.getKey(); // e.g. "Week1"
                Double hours = entry.getValue();
                if (hours == null || hours <= 0) continue;

                int weekNum = Integer.parseInt(weekKey.replace("Week", ""));
                LocalDate weekStart = startDate.plusWeeks(weekNum - 1);

                PlannedTaskAllocationRecord record = new PlannedTaskAllocationRecord();
                record.setTaskId(dto.getTaskId());
                record.setTutorId(tutorId);
                record.setWeekStart(weekStart);
                record.setPlannedHours(hours);
                record.setPayRate(dto.getPayRate());
                record.setPayCategory(dto.getPayCategory());
                record.setNote(null);
                record.setCreatedBy(createdBy);

                records.add(record);
            }
        }

        // 3. 批量 upsert
        if (!records.isEmpty()) {
            plannedTaskAllocationMapper.batchUpsert(records);
        }

        // 发布事件（触发异步通知）
        notificationService.publishTaskAllocation(createdBy, tutorId, records.size());

    }

    @Transactional
    @Override
    public void updateAllocationHours(Long id, double plannedHours, Long updatedBy) {
        plannedTaskAllocationMapper.updateHours(id, plannedHours, updatedBy);
        notificationService.publishTaskUpdated(id, plannedHours, updatedBy);
    }

    @Transactional
    @Override
    public void deleteByTutorAndTask(Long tutorId, Long taskId) {
        plannedTaskAllocationMapper.deleteByTutorAndTask(tutorId, taskId);
        notificationService.publishTaskDeleted(tutorId, taskId);
    }

}
