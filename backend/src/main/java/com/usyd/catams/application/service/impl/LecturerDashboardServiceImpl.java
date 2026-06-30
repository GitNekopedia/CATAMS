package com.usyd.catams.application.service.impl;

import com.usyd.catams.adapter.persistence.LecturerDashboardMapper;
import com.usyd.catams.adapter.web.dto.LecturerOverviewDTO;
import com.usyd.catams.application.service.LecturerDashBoardService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LecturerDashboardServiceImpl implements LecturerDashBoardService {

    private final LecturerDashboardMapper lecturerDashboardMapper;
    @Override
    public LecturerOverviewDTO getLecturerOverview(Long id) {
        return lecturerDashboardMapper.getLecturerOverview(id);
    }
}
