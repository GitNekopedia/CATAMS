package com.usyd.catams.adapter.persistence;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.adapter.web.dto.*;
import com.usyd.catams.domain.model.UnitAssignment;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface UnitAssignmentMapper extends BaseMapper<UnitAssignment> {

    @Select("""
            SELECT ua.id,
                   ua.unit_id   AS unitId,
                   cu.code      AS code,
                   cu.name      AS name,
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
            SELECT u.id, u.name
            FROM unit_assignment ua Join user u on ua.user_id = u.id
            WHERE ua.unit_id = #{unitId} AND ua.role = 'TUTOR'
            """)
    List<TutorOfCourseDTO> getTutorsOfTheCourse(Long unitId);


    /** 查询分配列表（支持按课程、角色、用户关键字过滤） */
    @Select("""
        SELECT 
            a.id,
            a.unit_id AS unitId,
            c.code AS courseCode,
            c.name AS courseName,
            c.semester,
            u.id AS userId,
            u.name AS userName,
            u.email AS userEmail,
            a.role,
            a.quota_hours AS quotaHours,
            a.actual_hours AS actualHours,
            a.actual_pay_total AS actualPayTotal
        FROM unit_assignment a
        JOIN course_unit c ON a.unit_id = c.id
        JOIN user u ON a.user_id = u.id
        WHERE (#{unitId} IS NULL OR a.unit_id = #{unitId})
          AND (#{role} IS NULL OR a.role = #{role})
          AND (#{semester} IS NULL OR c.semester = #{semester})
          AND (#{keyword} IS NULL OR u.name LIKE CONCAT('%', #{keyword}, '%') OR u.email LIKE CONCAT('%', #{keyword}, '%'))
        ORDER BY a.created_at DESC
    """)
    List<UnitAssignmentDTO> selectAssignments(@Param("unitId") Long unitId,
                                              @Param("role") String role,
                                              @Param("semester") String semester,
                                              @Param("keyword") String keyword);


    /** 更新分配记录 */
    @Update("""
        UPDATE unit_assignment
        SET user_id = #{userId},
            role = #{role},
            pay_rate = #{payRate},
            quota_hours = #{quotaHours}
        WHERE id = #{id}
    """)
    void update(UnitAssignment entity);

    /** 删除分配记录 */
    @Delete("DELETE FROM unit_assignment WHERE id = #{id}")
    void delete(Long id);

    /** 查询某门课程的全部分配记录 */
    @Select("""
        SELECT 
            a.id, a.unit_id AS unitId, c.code AS courseCode, c.name AS courseName,
            u.id AS userId, u.name AS userName, u.email AS userEmail, a.role, a.pay_rate AS payRate, a.quota_hours AS quotaHours
        FROM unit_assignment a
        JOIN course_unit c ON a.unit_id = c.id
        JOIN user u ON a.user_id = u.id
        WHERE a.unit_id = #{unitId}
        ORDER BY a.created_at DESC
    """)
    List<UnitAssignmentDTO> selectByCourseId(Long unitId);

}