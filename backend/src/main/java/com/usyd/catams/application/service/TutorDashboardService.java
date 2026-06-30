package com.usyd.catams.application.service;

import com.usyd.catams.adapter.web.dto.TutorOverviewDTO;

public interface TutorDashboardService {

    TutorOverviewDTO getTutorOverview(Long id);
}
