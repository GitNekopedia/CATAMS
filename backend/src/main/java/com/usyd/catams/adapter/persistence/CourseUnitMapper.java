package com.usyd.catams.adapter.persistence;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.adapter.web.dto.CourseUnitDTO;
import com.usyd.catams.adapter.web.dto.TutorCourseDTO;
import com.usyd.catams.domain.model.CourseUnit;
import com.usyd.catams.domain.model.UnitAssignment;
import org.apache.ibatis.annotations.*;


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



    @Select("""
        SELECT id, code, name, semester, start_date, end_date,
               total_budget_hours, remaining_budget, created_at, updated_at
        FROM course_unit
        WHERE (#{code} IS NULL OR code LIKE CONCAT('%', #{code}, '%'))
          AND (#{name} IS NULL OR name LIKE CONCAT('%', #{name}, '%'))
          AND (#{semester} IS NULL OR semester = #{semester})
          AND (#{minBudget} IS NULL OR remaining_budget >= #{minBudget})
          AND (#{maxBudget} IS NULL OR remaining_budget <= #{maxBudget})
          AND (#{startDate} IS NULL OR start_date >= #{startDate})
          AND (#{endDate} IS NULL OR end_date <= #{endDate})
        ORDER BY ${sortField} ${sortOrder}
        LIMIT #{pageSize} OFFSET #{offset}
    """)
    List<CourseUnitDTO> selectPaged(@Param("code") String code,
                                    @Param("name") String name,
                                    @Param("semester") String semester,
                                    @Param("minBudget") Double minBudget,
                                    @Param("maxBudget") Double maxBudget,
                                    @Param("startDate") String startDate,
                                    @Param("endDate") String endDate,
                                    @Param("offset") int offset,
                                    @Param("pageSize") int pageSize,
                                    @Param("sortField") String sortField,
                                    @Param("sortOrder") String sortOrder);

    @Select("""
        SELECT COUNT(*) FROM course_unit
        WHERE (#{code} IS NULL OR code LIKE CONCAT('%', #{code}, '%'))
          AND (#{name} IS NULL OR name LIKE CONCAT('%', #{name}, '%'))
          AND (#{semester} IS NULL OR semester = #{semester})
          AND (#{minBudget} IS NULL OR remaining_budget >= #{minBudget})
          AND (#{maxBudget} IS NULL OR remaining_budget <= #{maxBudget})
          AND (#{startDate} IS NULL OR start_date >= #{startDate})
          AND (#{endDate} IS NULL OR end_date <= #{endDate})
    """)
    long countByCondition(@Param("code") String code,
                          @Param("name") String name,
                          @Param("semester") String semester,
                          @Param("minBudget") Double minBudget,
                          @Param("maxBudget") Double maxBudget,
                          @Param("startDate") String startDate,
                          @Param("endDate") String endDate);

    @Insert("""
        INSERT INTO course_unit(code, name, semester, start_date, end_date, total_budget_hours, remaining_budget)
        VALUES(#{code}, #{name}, #{semester}, #{startDate}, #{endDate}, #{totalBudgetHours}, #{remainingBudget})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(CourseUnit entity);

    @Update("""
        UPDATE course_unit
        SET code=#{code}, name=#{name}, semester=#{semester},
            start_date=#{startDate}, end_date=#{endDate},
            total_budget_hours=#{totalBudgetHours}, remaining_budget=#{remainingBudget}
        WHERE id=#{id}
    """)
    void update(CourseUnit entity);

    @Delete("DELETE FROM course_unit WHERE id=#{id}")
    void delete(Long id);

    /** 安全白名单：防止SQL注入 */
    default String getSafeSortField(String sortField) {
        if (sortField == null) return "created_at";
        return switch (sortField) {
            case "code" -> "code";
            case "name" -> "name";
            case "semester" -> "semester";
            case "startDate" -> "start_date";
            case "endDate" -> "end_date";
            case "totalBudgetHours" -> "total_budget_hours";
            case "remainingBudget" -> "remaining_budget";
            default -> "created_at";
        };
    }

}
