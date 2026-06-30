package com.usyd.catams.adapter.persistence;

import com.usyd.catams.adapter.web.dto.TutorOverviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface TutorDashboardMapper {

    /**
     * 获取Tutor个人概览统计信息
     *
     * @param tutorId Tutor ID
     * @return 概览DTO
     */
    @Select("""
        SELECT
            -- 课程数量
            COUNT(DISTINCT cu.id) AS course_count,

            -- 待审批数量（所有非最终批准、非草稿）
            SUM(CASE 
                    WHEN we.status IN ('SUBMITTED','APPROVED_BY_LECTURER','REJECTED') 
                    THEN 1 ELSE 0 
                END) AS pending_count,

            -- 已审批数量（最终批准）
            SUM(CASE 
                    WHEN we.status = 'FINAL_APPROVED' 
                    THEN 1 ELSE 0 
                END) AS approved_count,

            -- 审批率
            ROUND(
                CASE 
                    WHEN COUNT(we.id) = 0 THEN 0
                    ELSE SUM(CASE WHEN we.status = 'FINAL_APPROVED' THEN 1 ELSE 0 END) / COUNT(we.id) * 100
                END, 2
            ) AS approval_rate,

            -- 总计通过工时
            COALESCE(SUM(CASE WHEN we.status = 'FINAL_APPROVED' THEN we.hours ELSE 0 END), 0) AS total_quota_hours,

            -- 未提交（计划减去实际提交）
            COALESCE(
                (SELECT COUNT(1)
                 FROM planned_task_allocation pta
                 WHERE pta.tutor_id = #{tutorId})
                -
                (SELECT COUNT(1)
                 FROM work_entry we2
                 WHERE we2.tutor_id = #{tutorId}),
                0
            ) AS unsubmitted_work_entries

        FROM unit_assignment ua
            LEFT JOIN course_unit cu ON ua.unit_id = cu.id
            LEFT JOIN work_entry we ON we.unit_id = cu.id AND we.tutor_id = ua.user_id
        WHERE ua.user_id = #{tutorId}
          AND ua.role = 'TUTOR'
    """)
    TutorOverviewDTO getTutorOverview(Long tutorId);

}
