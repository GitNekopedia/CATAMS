package com.usyd.catams.adapter.persistence;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.domain.model.CourseUnit;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;


import java.util.List;

@Mapper

public interface CourseUnitMapper extends BaseMapper<CourseUnit> {
    // 获取指定导师分配的所有课程信息（含剩余预算）
    @Select("""
                SELECT cu.* FROM course_unit cu
                JOIN tutor_assignment ta ON cu.id = ta.unit_id
                WHERE ta.tutor_id = #{tutorId}
            """)
    List<CourseUnit> findByTutorId(@Param("tutorId") Long tutorId);

    @Select("""
                SELECT IFNULL(SUM(cu.remaining_budget), 0)
                FROM course_unit cu
                JOIN tutor_assignment ta ON cu.id = ta.unit_id
                WHERE ta.tutor_id = #{tutorId}
            """)
    Double totalRemainingBudget(@Param("tutorId") Long tutorId);

    // 根据课程 ID 获取课程详情
    @Select("SELECT * FROM course_unit WHERE id = #{id}")
    CourseUnit findById(@Param("id") Long id);
}
