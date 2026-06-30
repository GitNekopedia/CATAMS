package com.usyd.catams.application.service.impl;

import com.usyd.catams.adapter.persistence.TutorDashboardMapper;
import com.usyd.catams.adapter.web.dto.TutorOverviewDTO;
import com.usyd.catams.application.service.TutorDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TutorDashboardServiceImpl implements TutorDashboardService {

    private final TutorDashboardMapper tutorDashboardMapper;

    @Override
    public TutorOverviewDTO getTutorOverview(Long id) {
        return tutorDashboardMapper.getTutorOverview(id);
    }
}
