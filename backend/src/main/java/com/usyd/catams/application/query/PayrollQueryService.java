package com.usyd.catams.application.query;

import com.usyd.catams.adapter.web.dto.TutorIncomeDTO;
import com.usyd.catams.adapter.web.dto.TutorIncomeDetailDTO;
import com.usyd.catams.adapter.web.dto.TutorIncomeTrendDTO;

import java.util.List;

public interface PayrollQueryService {

    TutorIncomeDTO getMonthlyIncomeByTutor(Long id, String targetMonth);

    List<TutorIncomeDTO> getMonthlyIncomeAll(Long tutorId, String targetMonth);

    List<TutorIncomeDetailDTO> getMonthlyIncomeDetailByTutor(Long id, String month);

    List<TutorIncomeDetailDTO> getMonthlyIncomeDetailAll(Long tutorId, String month);

    List<TutorIncomeTrendDTO> getYearlyIncomeByTutor(Long tutorId, String year);
}
