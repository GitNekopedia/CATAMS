package com.usyd.catams.adapter.persistence;

import com.usyd.catams.adapter.web.dto.TutorIncomeDTO;
import com.usyd.catams.adapter.web.dto.TutorIncomeDetailDTO;
import com.usyd.catams.adapter.web.dto.TutorIncomeTrendDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PayrollMapper {

    @Select("""
        SELECT 
            we.tutor_id AS tutorId,
            u.name AS tutorName,
            DATE_FORMAT(we.week_start, '%Y-%m') AS month,
            SUM(we.hours) AS totalHours,
            SUM(we.hours * we.pay_rate_snapshot) AS totalIncome
        FROM work_entry we
        JOIN user u ON we.tutor_id = u.id
        WHERE we.status = 'FINAL_APPROVED'
          AND DATE_FORMAT(we.week_start, '%Y-%m') = #{month}
          AND we.tutor_id = #{tutorId}
        GROUP BY we.tutor_id, u.name, DATE_FORMAT(we.week_start, '%Y-%m')
        """)
    TutorIncomeDTO selectMonthlyIncomeByTutor(Long tutorId, String month);

    @Select("""
        SELECT 
            we.tutor_id AS tutorId,
            u.name AS tutorName,
            DATE_FORMAT(we.week_start, '%Y-%m') AS month,
            SUM(we.hours) AS totalHours,
            SUM(we.hours * we.pay_rate_snapshot) AS totalIncome
        FROM work_entry we
        JOIN user u ON we.tutor_id = u.id
        WHERE we.status = 'FINAL_APPROVED'
          AND DATE_FORMAT(we.week_start, '%Y-%m') = #{month}
          AND (#{tutorId} IS NULL OR we.tutor_id = #{tutorId})
        GROUP BY we.tutor_id, u.name, DATE_FORMAT(we.week_start, '%Y-%m')
        """)
    List<TutorIncomeDTO> selectMonthlyIncomeAll(Long tutorId, String month);

    @Select("""
        SELECT 
            we.id AS entryId,
            we.unit_code AS unitCode,
            we.unit_name AS unitName,
            ut.name AS taskName,
            we.week_start AS weekStart,
            we.hours AS hours,
            we.pay_rate_snapshot AS payRate,
            ROUND(we.hours * we.pay_rate_snapshot, 2) AS amount
        FROM work_entry we
        LEFT JOIN unit_task ut ON we.task_id = ut.id
        WHERE we.status = 'FINAL_APPROVED'
          AND we.tutor_id = #{tutorId}
          AND DATE_FORMAT(we.week_start, '%Y-%m') = #{month}
        ORDER BY we.week_start ASC
        """)
    List<TutorIncomeDetailDTO> selectMonthlyIncomeDetailByTutor(Long tutorId, String month);

    @Select("""
        SELECT 
            we.tutor_id AS tutorId,
            u.name AS tutorName,
            we.id AS entryId,
            we.unit_code AS unitCode,
            we.unit_name AS unitName,
            ut.name AS taskName,
            we.week_start AS weekStart,
            we.hours AS hours,
            we.pay_rate_snapshot AS payRate,
            ROUND(we.hours * we.pay_rate_snapshot, 2) AS amount
        FROM work_entry we
        JOIN user u ON we.tutor_id = u.id
        LEFT JOIN unit_task ut ON we.task_id = ut.id
        WHERE we.status = 'FINAL_APPROVED'
          AND (#{tutorId} IS NULL OR we.tutor_id = #{tutorId})
          AND DATE_FORMAT(we.week_start, '%Y-%m') = #{month}
        ORDER BY we.tutor_id, we.week_start ASC
        """)
    List<TutorIncomeDetailDTO> selectMonthlyIncomeDetailAll(Long tutorId, String month);

    @Select("""
        SELECT 
            DATE_FORMAT(we.week_start, '%Y-%m') AS month,
            SUM(we.hours * we.pay_rate_snapshot) AS total_income,
            SUM(we.hours) AS total_hours
        FROM work_entry we
        WHERE we.tutor_id = #{tutorId}
          AND DATE_FORMAT(we.week_start, '%Y') = #{year}
          AND we.status = 'FINAL_APPROVED'
        GROUP BY DATE_FORMAT(we.week_start, '%Y-%m')
        ORDER BY month
    """)
    List<TutorIncomeTrendDTO> selectYearlyIncomeByTutor(
            @Param("tutorId") Long tutorId,
            @Param("year") String year
    );
}
