package com.usyd.catams.adapter.persistence;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.domain.model.WorkEntry;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WorkEntryMapper extends BaseMapper<WorkEntry> {
    @Select("""
                SELECT * FROM work_entry
                WHERE tutor_id = #{tutorId}
                ORDER BY week_start DESC
                LIMIT 7
            """)
    List<WorkEntry> findRecentByTutorId(@Param("tutorId") Long tutorId);

    @Select("""
                SELECT COUNT(*) FROM work_entry
                WHERE tutor_id = #{tutorId}
            """)
    int countByTutorId(@Param("tutorId") Long tutorId);

    @Select("""
                SELECT 
                  ROUND(SUM(CASE 
                      WHEN status IN ('APPROVED_BY_LECTURER', 'APPROVED_BY_TUTOR', 'FINAL_APPROVED') 
                      THEN 1 ELSE 0 END) / COUNT(*), 2)
                FROM work_entry
                WHERE tutor_id = #{tutorId}
            """)
    Double approvalProgress(@Param("tutorId") Long tutorId);

    // 获取指定导师最近提交的 N 条工时记录（带课程名）
    @Select("""
                SELECT we.*, cu.name AS unit_name
                FROM work_entry we
                JOIN course_unit cu ON we.unit_id = cu.id
                WHERE we.tutor_id = #{tutorId}
                ORDER BY we.week_start DESC
                LIMIT #{limit}
            """)
    List<WorkEntry> findRecentByTutor(@Param("tutorId") Long tutorId, @Param("limit") int limit);


    // 获取指定导师本月提交的总工时数
    @Select("""
            SELECT IFNULL(SUM(hours), 0)
            FROM work_entry
            WHERE tutor_id = #{tutorId}
            AND status IN ('SUBMITTED','APPROVED_BY_LECTURER','APPROVED_BY_TUTOR','FINAL_APPROVED')
            AND MONTH(week_start) = MONTH(CURDATE())
            AND YEAR(week_start) = YEAR(CURDATE())
            """)
    Double sumMonthlySubmittedHours(@Param("tutorId") Long tutorId);


    // 获取指定导师所有课程的预算剩余小时总和
    @Select("""
            SELECT IFNULL(SUM(cu.remaining_budget), 0)
            FROM course_unit cu
            JOIN tutor_assignment ta ON cu.id = ta.unit_id
            WHERE ta.tutor_id = #{tutorId}
            """)
    Double sumRemainingBudgetHours(@Param("tutorId") Long tutorId);


    // 获取导师待审批工时条数（可根据实际业务调整逻辑）
    @Select("""
            SELECT COUNT(*)
            FROM work_entry
            WHERE status = 'SUBMITTED'
            AND unit_id IN (
            SELECT unit_id FROM tutor_assignment WHERE tutor_id = #{tutorId}
            )
            """)
    Integer countPendingApprovals(@Param("tutorId") Long tutorId);
}
