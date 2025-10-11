package com.usyd.catams.adapter.persistence;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.adapter.web.dto.ApprovalTaskDTO;
import com.usyd.catams.adapter.web.dto.DetailedWorkEntryDTO;
import com.usyd.catams.adapter.web.dto.LecturerPendingWorkEntryDTO;
import com.usyd.catams.adapter.web.dto.WorkEntryDTO;
import com.usyd.catams.domain.model.WorkEntry;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface WorkEntryMapper extends BaseMapper<WorkEntry> {

    @Select("""
                SELECT ua.user_id
                FROM work_entry we
                JOIN unit_assignment ua On we.unit_id = ua.unit_id
                WHERE
                we.id = #{workEntryId}
                AND
                ua.role = 'LECTURER'
            """)
    List<Long> findLecturerIdByWorkEntryId(@Param("workEntryId") Long workEntryId);

    @Select("""
                SELECT * FROM work_entry
                WHERE tutor_id = #{tutorId}
                ORDER BY created_at DESC
                LIMIT #{limit}
            """)
    List<WorkEntry> findRecentByTutor(@Param("tutorId") Long tutorId, @Param("limit") int limit);

    @Select("""
                SELECT * FROM work_entry
                WHERE id = #{id}
                LIMIT 1
            """)
    WorkEntry findById(@Param("id") Long id);

    // 批量按 ID 查询（MyBatis 动态 SQL）
    @Select({"<script>", "SELECT * FROM work_entry WHERE id IN", "<foreach collection='ids' item='id' open='(' separator=',' close=')'>", "#{id}", "</foreach>", "</script>"})
    List<WorkEntry> findByIds(@Param("ids") List<Long> ids);

    // 若你用到了“讲师待审批”的查询，也可保留这个（示例，已在前面给过）
    @Select("""
              SELECT we.* FROM work_entry we
              JOIN approval_task at ON at.entry_id = we.id
              WHERE at.step = 'LECTURER' AND at.action IS NULL
              ORDER BY we.created_at DESC
            """)
    List<WorkEntry> findPendingForLecturer();

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
                  COALESCE(
                    ROUND(SUM(CASE 
                        WHEN status IN ('APPROVED_BY_LECTURER','APPROVED_BY_TUTOR','FINAL_APPROVED') 
                        THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2),
                    0
                  )
                FROM work_entry
                WHERE tutor_id = #{tutorId}
            """)
    Double approvalProgress(@Param("tutorId") Long tutorId);


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

    @Select("""
            SELECT * FROM work_entry
            WHERE tutor_id = #{tutorId}
            ORDER BY week_start DESC
            """)
    List<WorkEntryDTO> findAllWorkEntriesByTutorId(Long tutorId);

    @Select("""
            SELECT
                 we.id                AS work_entry_id,
                 we.tutor_id,
                 t.name               AS tutor_name,
                 we.unit_id,
                 we.unit_code,
                 we.unit_name,
                 we.week_start,
                 we.hours,
                 we.work_type,
                 we.description,
                 we.status,
                 at.id                AS approval_task_id,
                 at.step,
                 at.action,
                 at.created_at        AS taskCreatedAt
             FROM work_entry we
             JOIN approval_task at ON we.id = at.entry_id
             JOIN unit_assignment ua ON we.unit_id = ua.unit_id
             JOIN user l ON ua.user_id = l.id
             JOIN user t ON we.tutor_id = t.id
             WHERE at.step = 'LECTURER'
               AND at.action IS NULL             -- 待审批
               AND ua.role = 'LECTURER'
               AND l.id = #{id}          -- 传入当前登录的讲师ID
             ORDER BY we.week_start DESC, we.id
             LIMIT #{limit};
            """)
    List<LecturerPendingWorkEntryDTO> findRecentWorkEntriesByLecturer(Long id, int limit);

    @Select("""
            SELECT COUNT(1)
             FROM work_entry we
             JOIN approval_task at ON we.id = at.entry_id
             JOIN unit_assignment ua ON we.unit_id = ua.unit_id
             JOIN user l ON ua.user_id = l.id
             JOIN user t ON we.tutor_id = t.id
             WHERE at.step = 'LECTURER'
               AND at.action IS NULL             -- 待审批
               AND ua.role = 'LECTURER'
               AND l.id = #{id}          -- 传入当前登录的讲师ID
             ORDER BY we.week_start DESC, we.id
             LIMIT #{limit};
            """)
    int countByLecturerId(Long id);

    @Select({
            "<script>",
            "SELECT",
            "  we.id              AS workEntryId,",
            "  we.tutor_id        AS tutorId,",
            "  u.name             AS tutorName,",
            "  cu.id              AS unitId,",
            "  cu.code            AS unitCode,",
            "  cu.name            AS unitName,",
            "  we.week_start      AS weekStart,",
            "  we.work_type       AS workType,",
            "  we.hours           AS hours,",
            "  we.description     AS description,",
            "  we.status          AS status,",
            "  we.updated_at      AS updatedAt",
            "FROM work_entry we",
            "JOIN user u ON we.tutor_id = u.id",
            "JOIN course_unit cu ON we.unit_id = cu.id",
            "WHERE we.unit_id IN",
            "<foreach collection='unitIds' item='unitId' open='(' separator=',' close=')'>",
            "  #{unitId}",
            "</foreach>",
            "ORDER BY we.created_at DESC",
            "</script>"
    })
    List<LecturerPendingWorkEntryDTO> findAllWorkEntriesByUnitIds(List<Long> unitIds);

    @Select({
            "<script>",
            "SELECT",
            "  at.id          AS id,",
            "  at.entry_id    AS entryId,",
            "  at.step        AS step,",
            "  at.action      AS action,",
            "  at.comment     AS comment,",
            "  at.actor_id    AS actorId,",
            "  u.name         AS actorName,",
            "  at.created_at  AS processTime",
            "FROM approval_task at",
            "LEFT JOIN user u ON at.actor_id = u.id",
            "WHERE at.entry_id IN",
            "<foreach collection='entryIds' item='entryId' open='(' separator=',' close=')'>",
            "  #{entryId}",
            "</foreach>",
            "ORDER BY at.created_at ASC",
            "</script>"
    })
    List<ApprovalTaskDTO> findTasksByEntryIds(List<Long> entryIds);

    @Update("""
            UPDATE work_entry
            SET status = #{status},
                version = version + 1,
                updated_at = NOW()
            WHERE id = #{entryId}
              AND version = #{version}
            """)
    int updateStatusWithVersion(@Param("entryId") Long entryId, @Param("status") String status, @Param("version") int version);
}
