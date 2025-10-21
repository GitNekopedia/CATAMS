package com.usyd.catams.adapter.persistence;

import com.usyd.catams.domain.model.UnitTask;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TaskMapper {

    @Insert("INSERT INTO unit_task(unit_id, type_id, name, is_active, created_at, updated_at) " +
            "VALUES(#{unitId}, #{typeId}, #{name}, 1, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(UnitTask task);

    @Select("SELECT * FROM unit_task WHERE id = #{id}")
    UnitTask findById(Long id);

    @Select("""
            SELECT ut.*, utt.phd_pay_rate, utt.non_phd_pay_rate
            FROM unit_task ut
            JOIN unit_task_type utt ON ut.type_id = utt.id
            WHERE ut.unit_id = #{unitId}
            """)
    List<UnitTask> findByUnitId(Long unitId);

    @Update("UPDATE unit_task SET name = #{name}, type_id = #{typeId}, updated_at = NOW() WHERE id = #{id}")
    int update(UnitTask task);

    @Update("UPDATE unit_task SET is_active = #{isActive}, updated_at = NOW() WHERE id = #{id}")
    int updateActive(@Param("id") Long id, @Param("isActive") Boolean isActive);

    @Delete("DELETE FROM unit_task WHERE id = #{id}")
    int delete(Long id);

    @Select("""
            SELECT utt.name
            FROM unit_task ut
            JOIN unit_task_type utt on ut.type_id = utt.id
            WHERE ut.id = #{taskId}
            """)
    String getTaskTypeById(Long taskId);
}
