package com.usyd.catams.adapter.persistence;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.adapter.web.dto.ApprovalTaskDTO;
import com.usyd.catams.adapter.web.dto.DetailedWorkEntryDTO;
import com.usyd.catams.domain.enums.ApprovalStep;
import com.usyd.catams.domain.model.ApprovalTask;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ApprovalTaskMapper extends BaseMapper<ApprovalTask> {

    @Insert("""
            INSERT INTO approval_task (entry_id, step, action, created_at)
            VALUES (#{entryId}, #{step}, NULL, NOW())
            """)
    void insertNewTask(@Param("entryId") Long entryId, @Param("step") ApprovalStep step);

    @Select("""
            SELECT at.id       AS task_id,
                   we.id       AS work_entry_id,
                   we.unit_code,
                   we.unit_name,
                   we.week_start,
                   we.hours,
                   we.work_type,
                   we.description,
                   t.name      AS tutor_name
            FROM approval_task at
                     JOIN work_entry we ON at.entry_id = we.id
                     JOIN unit_assignment ua ON ua.unit_id = we.unit_id AND ua.role = 'LECTURER'
                     JOIN user lec ON lec.id = ua.user_id
                     JOIN user t   ON t.id = we.tutor_id
            WHERE at.step = 'LECTURER'
              AND at.action IS NULL
              AND lec.id = #{id};
            """)
    List<ApprovalTaskDTO> findPendingByLecturer(Long id);

    @Select("""
            <script>
            SELECT at.id,
                   at.entry_id      AS entryId,
                   at.step,
                   at.action,
                   at.comment,
                   at.actor_id,
                   u.name           AS actorName,
                   at.created_at    AS processTime
            FROM approval_task at
            LEFT JOIN user u ON at.actor_id = u.id
            WHERE at.entry_id IN
            <foreach collection="entryIds" item="id" open="(" separator="," close=")">
                #{id}
            </foreach>
            ORDER BY at.entry_id, at.created_at ASC
            </script>
            """)
    List<ApprovalTaskDTO> findTasksByEntryIds(@Param("entryIds") List<Long> allEntryIds);

    @Update("""
            UPDATE approval_task
            SET action = #{action},
                comment = #{comment},
                actor_id = #{actorId},
                actor_name = #{actorName},
                updated_at = NOW()
            WHERE entry_id = #{entryId}
              AND step = #{step}
              AND action IS NULL
            """)
    int updateTaskAction(@Param("entryId") Long entryId, @Param("step") String step, @Param("action") String action, @Param("comment") String comment, @Param("actorId") Long actorId, @Param("actorName") String actorName);

}



