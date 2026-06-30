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

    @Select("""
            SELECT * FROM work_entry
            WHERE tutor_id = #{tutorId}
            ORDER BY week_start DESC
            """)
    List<WorkEntryDTO> findAllWorkEntriesByTutorId(Long tutorId);

    @Select("""
            SELECT
                 we.id                AS work_entry_id,
                 we.unit_code,
                 we.unit_name,
                 we.hours,
                 we.work_type,
                 we.status,
                 we.created_at
            FROM work_entry we
            JOIN unit_assignment ua ON we.unit_id = ua.unit_id
             WHERE we.status = 'SUBMITTED'  -- 待审批
               AND ua.role = 'LECTURER'
               AND ua.user_id = #{id}          -- 传入当前登录的讲师ID
             ORDER BY we.created_at DESC
             LIMIT #{limit};
            """)
    List<LecturerPendingWorkEntryDTO> findRecentWorkEntriesByLecturer(Long id, int limit);

    @Select({"<script>", "SELECT", "  we.id              AS workEntryId,", "  we.tutor_id        AS tutorId,", "  u.name             AS tutorName,", "  cu.id              AS unitId,", "  cu.code            AS unitCode,", "  cu.name            AS unitName,", "  we.week_start      AS weekStart,", "  we.work_type       AS workType,", "  we.hours           AS hours,", "  we.description     AS description,", "  we.status          AS status,", "  we.updated_at      AS updatedAt", "FROM work_entry we", "JOIN user u ON we.tutor_id = u.id", "JOIN course_unit cu ON we.unit_id = cu.id", "WHERE we.unit_id IN", "<foreach collection='unitIds' item='unitId' open='(' separator=',' close=')'>", "  #{unitId}", "</foreach>", "ORDER BY we.created_at DESC", "</script>"})
    List<LecturerPendingWorkEntryDTO> findAllWorkEntriesByUnitIds(List<Long> unitIds);

    @Select("""
    SELECT 
        w.id AS workEntryId,
        w.tutor_id AS tutorId,
        u.name AS tutorName,
        w.unit_id AS unitId,
        c.code AS unitCode,
        c.name AS unitName,
        c.semester,
        w.week_start AS weekStart,
        w.work_type AS workType,
        w.hours,
        w.description,
        w.status,
        w.created_at AS createdAt,
        w.updated_at AS updatedAt
    FROM work_entry w
    JOIN course_unit c ON w.unit_id = c.id
    JOIN user u ON w.tutor_id = u.id
    ORDER BY w.created_at DESC
""")
    List<LecturerPendingWorkEntryDTO> findAllWorkEntries();

    @Select("SELECT COUNT(*) FROM work_entry WHERE status = 'APPROVED_BY_LECTURER'")
    long countPending();

}
