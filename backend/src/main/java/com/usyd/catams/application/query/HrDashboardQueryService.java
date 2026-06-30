package com.usyd.catams.application.query;

import com.usyd.catams.adapter.persistence.*;
import com.usyd.catams.adapter.web.dto.HrOverviewDTO;
import org.springframework.stereotype.Service;

@Service
public class HrDashboardQueryService {

    private final CourseUnitMapper courseMapper;
    private final UserMapper userMapper;
    private final WorkEntryMapper workEntryMapper;

    public HrDashboardQueryService(CourseUnitMapper courseMapper,
                                   UserMapper userMapper,
                                   WorkEntryMapper workEntryMapper) {
        this.courseMapper = courseMapper;
        this.userMapper = userMapper;
        this.workEntryMapper = workEntryMapper;
    }

    /**
     * 获取 HR 仪表盘概览数据
     */
    public HrOverviewDTO getOverview() {
        long totalCourses = courseMapper.countAll();
        long totalTutors = userMapper.countByRole("TUTOR");
        long pendingApprovals = workEntryMapper.countPending();
        double totalBudgetHours = courseMapper.sumTotalBudgetHours();
        double remainingBudgetHours = courseMapper.sumRemainingBudgetHours();

        return new HrOverviewDTO(totalCourses, totalTutors, pendingApprovals, totalBudgetHours, remainingBudgetHours);
    }
}
