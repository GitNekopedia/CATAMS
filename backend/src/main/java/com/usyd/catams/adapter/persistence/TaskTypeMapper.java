package com.usyd.catams.adapter.persistence;

import com.usyd.catams.domain.model.UnitTaskType;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TaskTypeMapper {

    @Insert("INSERT INTO unit_task_type(unit_id, name, phd_pay_rate, non_phd_pay_rate, created_at, updated_at) " +
            "VALUES(#{unitId}, #{name}, #{phdPayRate}, #{nonPhdPayRate}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(UnitTaskType taskType);

    @Select("SELECT * FROM unit_task_type WHERE id = #{id}")
    UnitTaskType findById(Long id);

    @Select("SELECT * FROM unit_task_type WHERE unit_id = #{unitId}")
    List<UnitTaskType> findByUnitId(Long unitId);

    @Select("SELECT * FROM unit_task_type WHERE unit_id = #{unitId} AND name = #{name}")
    UnitTaskType findByUnitAndName(@Param("unitId") Long unitId, @Param("name") String name);


    @Update("UPDATE unit_task_type SET name = #{name}, updated_at = NOW() WHERE id = #{id}")
    int update(UnitTaskType taskType);

    @Delete("DELETE FROM unit_task_type WHERE id = #{id}")
    int delete(Long id);
}
