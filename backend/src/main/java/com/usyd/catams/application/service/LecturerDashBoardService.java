package com.usyd.catams.application.service;

import com.usyd.catams.adapter.web.dto.LecturerOverviewDTO;

public interface LecturerDashBoardService {

    LecturerOverviewDTO getLecturerOverview(Long id);
}
