package com.usyd.catams.adapter.persistence;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.adapter.web.dto.LecturerCourseDTO;
import com.usyd.catams.adapter.web.dto.LoginResponse;
import com.usyd.catams.adapter.web.dto.TutorCourseDTO;
import com.usyd.catams.adapter.web.dto.TutorOfCourseDTO;
import com.usyd.catams.domain.model.UnitAssignment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface UnitAssignmentMapper extends BaseMapper<UnitAssignment> {

    @Select("""
            SELECT ua.id,
                   ua.unit_id   AS unitId,
                   cu.code      AS code,
                   cu.name      AS name,
                   ua.pay_rate  AS payRate,
                   ua.quota_hours AS quotaHours
            FROM unit_assignment ua
            JOIN course_unit cu ON ua.unit_id = cu.id
            WHERE ua.user_id = #{tutorId}
              AND ua.role = 'TUTOR'
            """)
    List<TutorCourseDTO> findTutorCourses(@Param("tutorId") Long tutorId);


    @Select("""
            SELECT pay_rate 
            FROM unit_assignment 
            WHERE user_id=#{tutorId} AND unit_id=#{unitId} AND role = 'TUTOR' LIMIT 1                                                                                                              
            """)
    BigDecimal findPayRate(Long tutorId, Long unitId);


    @Select("""
            SELECT ua.id,
               ua.unit_id   AS unitId,
               cu.code      AS code,
               cu.name      AS name,
               cu.total_budget_hours AS totalBudgetHours,
               cu.remaining_budget AS remainingBudget
            FROM unit_assignment ua
            JOIN course_unit cu ON ua.unit_id = cu.id
            WHERE ua.user_id = #{id}
              AND ua.role = 'LECTURER'
            """)
    List<LecturerCourseDTO> findLecturerCourses(Long id);

    @Select("""
            SELECT u.id, u.name, ua.pay_rate
            FROM unit_assignment ua Join user u on ua.user_id = u.id
            WHERE ua.unit_id = #{unitId} AND ua.role = 'TUTOR'
            """)
    List<TutorOfCourseDTO> getTutorsOfTheCourse(Long unitId);

}