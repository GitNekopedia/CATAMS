package com.usyd.catams.application.service;

import com.usyd.catams.adapter.persistence.PlannedTaskAllocationMapper;
import com.usyd.catams.adapter.web.dto.PlannedAllocationDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutorAllocationService {
    private final PlannedTaskAllocationMapper plannedTaskAllocationMapper;

    public TutorAllocationService(PlannedTaskAllocationMapper plannedTaskAllocationMapper) {
        this.plannedTaskAllocationMapper = plannedTaskAllocationMapper;
    }

    public List<PlannedAllocationDTO> getAllocationsByTutor(Long tutorId, Long unitId) {
        return plannedTaskAllocationMapper.findAllocationsByTutor(tutorId, unitId);
    }
}
