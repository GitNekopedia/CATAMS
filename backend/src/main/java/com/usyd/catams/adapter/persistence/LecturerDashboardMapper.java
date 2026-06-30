package com.usyd.catams.adapter.persistence;

import com.usyd.catams.adapter.web.dto.LecturerOverviewDTO;
import org.apache.ibatis.annotations.*;

@Mapper
public interface LecturerDashboardMapper{

    @Select("""
                SELECT
                    -- 课程数（去重）
                    COUNT(DISTINCT cu.id) AS course_count,

                    -- 待审批数量
                    SUM(CASE WHEN we.status = 'SUBMITTED' THEN 1 ELSE 0 END) AS pending_count,

                    -- 已审批数量
                    SUM(CASE WHEN we.status IN ('APPROVED_BY_LECTURER', 'FINAL_APPROVED') THEN 1 ELSE 0 END) AS approved_count,

                    -- 审批率
                    ROUND(
                        CASE 
                            WHEN COUNT(we.id) = 0 THEN 0
                            ELSE SUM(CASE WHEN we.status IN ('APPROVED_BY_LECTURER','FINAL_APPROVED') THEN 1 ELSE 0 END) / COUNT(we.id) * 100
                        END, 2
                    ) AS approval_rate,

                    -- 平均预算使用率
                    ROUND(AVG(
                        CASE 
                            WHEN cu.total_budget_hours > 0 
                            THEN (cu.total_budget_hours - cu.remaining_budget) / cu.total_budget_hours
                            ELSE 0 
                        END
                    ) * 100, 2) AS average_budget_usage,

                    -- 剩余预算
                    COALESCE(SUM(cu.remaining_budget), 0) AS total_remaining_budget

                FROM unit_assignment ua
                    LEFT JOIN course_unit cu ON ua.unit_id = cu.id
                    LEFT JOIN work_entry we ON we.unit_id = cu.id
                WHERE ua.user_id = #{lecturerId}
                  AND ua.role = 'LECTURER'
            """)
    LecturerOverviewDTO getLecturerOverview(Long lecturerId);
}
