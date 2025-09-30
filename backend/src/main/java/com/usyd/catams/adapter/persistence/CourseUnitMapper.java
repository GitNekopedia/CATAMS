package com.usyd.catams.adapter.persistence;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.adapter.web.dto.TutorCourseDTO;
import com.usyd.catams.domain.model.CourseUnit;
import com.usyd.catams.domain.model.UnitAssignment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;


import java.time.LocalDate;
import java.util.List;

@Mapper

public interface CourseUnitMapper extends BaseMapper<UnitAssignment> {


    @Select("""
                SELECT IFNULL(SUM(cu.remaining_budget), 0)
                FROM course_unit cu
                JOIN unit_assignment ta ON cu.id = ta.unit_id
                WHERE ta.id = #{tutorId} AND ta.role = 'TUTOR'
            """)
    Double totalRemainingBudget(@Param("tutorId") Long tutorId);

    // 根据课程 ID 获取课程详情
    @Select("SELECT * FROM course_unit WHERE id = #{id} LIMIT 1")
    CourseUnit findById(@Param("id") Long id);

    // 根据课程 ID 获取课程的讲师 ID
    @Select("""
            SELECT ua.user_id 
            FROM unit_assignment ua 
            JOIN course_unit cu ON cu.id = ua.unit_id 
            WHERE cu.id = #{unitId} AND ua.role = 'LECTURER'
            """)
    Long findLecturerId(Long unitId);


    /**
     * 根据 unitId 查找课程的 start_date
     */
    @Select("SELECT start_date FROM course_unit WHERE id = #{unitId}")
    LocalDate findStartDateByUnitId(@Param("unitId") Long unitId);

}
