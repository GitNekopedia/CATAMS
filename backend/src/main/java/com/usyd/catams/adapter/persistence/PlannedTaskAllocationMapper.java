package com.usyd.catams.adapter.persistence;

import com.usyd.catams.adapter.web.dto.AllocationResponse;
import com.usyd.catams.adapter.web.dto.PlannedAllocationDTO;
import com.usyd.catams.domain.model.PlannedTaskAllocationRecord;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface PlannedTaskAllocationMapper {

    /**
     * 查某个课程下的所有分配
     */
    @Select("""
        SELECT a.id,
               ut.unit_id,
               a.tutor_id,
               a.task_id,
               ut.name       AS taskName,
               utt.name      AS typeName,
               a.pay_category,
               a.pay_rate,
               a.week_start,
               a.planned_hours
        FROM planned_task_allocation a
                 JOIN unit_task ut ON a.task_id = ut.id
                 JOIN unit_task_type utt ON ut.type_id = utt.id
        WHERE ut.unit_id = #{unitId}
        ORDER BY a.tutor_id, a.task_id, a.week_start
        """)
    List<AllocationResponse> findByUnitId(@Param("unitId") Long unitId);

    /**
     * 插入一条分配记录
     */
    @Insert("""
        INSERT INTO planned_task_allocation
            (task_id, tutor_id, week_start, planned_hours, note, created_by)
        VALUES (#{taskId}, #{tutorId}, #{weekStart}, #{plannedHours}, #{note}, #{createdBy})
        """)
    void insert(PlannedTaskAllocationRecord record);

    /**
     * 更新某条记录的工时
     */
    @Update("""
        UPDATE planned_task_allocation
        SET planned_hours = #{plannedHours},
            updated_at = NOW()
        WHERE id = #{id}
        """)
    void updateHours(@Param("id") Long id,
                     @Param("plannedHours") double plannedHours,
                     @Param("updatedBy") Long updatedBy);




    /**
     * 批量 upsert（存在则更新，不存在则插入）
     */
    @Insert("""
        <script>
        INSERT INTO planned_task_allocation
            (task_id, tutor_id, week_start, planned_hours, pay_rate, pay_category, note, created_by)
        VALUES
        <foreach collection="records" item="r" separator=",">
            (#{r.taskId}, #{r.tutorId}, #{r.weekStart}, #{r.plannedHours}, COALESCE(#{r.payRate}, 50.10), #{r.payCategory}, #{r.note}, #{r.createdBy})
        </foreach>
        ON DUPLICATE KEY UPDATE
            planned_hours = VALUES(planned_hours),
            updated_at = NOW()
        </script>
        """)
    void batchUpsert(@Param("records") List<PlannedTaskAllocationRecord> records);

    /**
     * 删除某条分配
     */
    @Delete("""
    DELETE FROM planned_task_allocation
    WHERE tutor_id = #{tutorId} AND task_id = #{taskId}
    """)
    void deleteByTutorAndTask(@Param("tutorId") Long tutorId,
                              @Param("taskId") Long taskId);

    @Select({
            "<script>",
            "SELECT",
            "    a.id,",
            "    ut.unit_id,",
            "    cu.code AS unitCode,",
            "    cu.name AS unitName,",
            "    a.tutor_id,",
            "    a.task_id,",
            "    ut.name AS taskName,",
            "    utt.name AS typeName,",
            "    a.week_start,",
            "    a.planned_hours,",
            "    a.pay_rate,",
            "    a.pay_category",
            "FROM planned_task_allocation a",
            "JOIN unit_task ut ON a.task_id = ut.id",
            "JOIN unit_task_type utt ON ut.type_id = utt.id",
            "JOIN course_unit cu ON ut.unit_id = cu.id",
            "WHERE a.tutor_id = #{tutorId}",
            "<if test='unitId != null'>",
            "  AND ut.unit_id = #{unitId}",
            "</if>",
            "ORDER BY a.week_start ASC",
            "</script>"
    })
    List<PlannedAllocationDTO> findAllocationsByTutor(
            @Param("tutorId") Long tutorId,
            @Param("unitId") Long unitId
    );


    @Select("SELECT pay_rate FROM planned_task_allocation WHERE task_id = #{taskId}")
    BigDecimal getPayRateByTaskId(Long taskId);
}
