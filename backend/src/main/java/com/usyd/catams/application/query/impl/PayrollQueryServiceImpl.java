package com.usyd.catams.application.query.impl;

import com.usyd.catams.adapter.persistence.PayrollMapper;
import com.usyd.catams.adapter.web.dto.TutorIncomeDTO;
import com.usyd.catams.adapter.web.dto.TutorIncomeDetailDTO;
import com.usyd.catams.adapter.web.dto.TutorIncomeTrendDTO;
import com.usyd.catams.application.query.PayrollQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class PayrollQueryServiceImpl implements PayrollQueryService {

    private final PayrollMapper payrollMapper;

    @Override
    public TutorIncomeDTO getMonthlyIncomeByTutor(Long id, String targetMonth) {
        return payrollMapper.selectMonthlyIncomeByTutor(id, targetMonth);
    }

    @Override
    public List<TutorIncomeDTO> getMonthlyIncomeAll(Long tutorId, String targetMonth) {
        return payrollMapper.selectMonthlyIncomeAll(tutorId, targetMonth);
    }

    @Override
    public List<TutorIncomeDetailDTO> getMonthlyIncomeDetailByTutor(Long tutorId, String month) {
        return payrollMapper.selectMonthlyIncomeDetailByTutor(tutorId, month);
    }

    @Override
    public List<TutorIncomeDetailDTO> getMonthlyIncomeDetailAll(Long tutorId, String month) {
        return payrollMapper.selectMonthlyIncomeDetailAll(tutorId, month);
    }

    @Override
    public List<TutorIncomeTrendDTO> getYearlyIncomeByTutor(Long tutorId, String year) {
        return payrollMapper.selectYearlyIncomeByTutor(tutorId, year);
    }
}
