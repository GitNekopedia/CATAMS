package com.usyd.catams.adapter.persistence;

import com.usyd.catams.domain.model.MoodRecord;
import org.apache.ibatis.annotations.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface MoodRecordMapper {

    @Insert("INSERT INTO mood_record (user_id, mood_score, description, record_date, created_at) " +
            "VALUES (#{userId}, #{moodScore}, #{description}, #{recordDate}, NOW())")
    void insert(MoodRecord record);

    @Select("SELECT * FROM mood_record WHERE user_id = #{userId} ORDER BY record_date DESC")
    List<MoodRecord> listByUser(@Param("userId") Long userId);

    /** ✅ 查询当天所有记录（可用于变化曲线） */
    @Select("""
        SELECT * FROM mood_record
        WHERE user_id = #{userId}
          AND record_date = #{date}
        ORDER BY created_at ASC
    """)
    List<MoodRecord> findAllOfDay(@Param("userId") Long userId, @Param("date") LocalDate date);

    /** ✅ 查询当天最新一条记录（用于展示今日 mood） */
    @Select("""
        SELECT * FROM mood_record
        WHERE user_id = #{userId}
          AND record_date = #{date}
        ORDER BY created_at DESC
        LIMIT 1
    """)
    MoodRecord findLatestOfDay(@Param("userId") Long userId, @Param("date") LocalDate date);

    // ✅ 月度统计：统计某月每天的平均心情
    @Select("""
        SELECT
            DATE_FORMAT(record_date, '%Y-%m-%d') AS date,
            ROUND(AVG(mood_score), 2) AS moodScore
        FROM mood_record
        WHERE user_id = #{userId}
          AND DATE_FORMAT(record_date, '%Y-%m') = #{month}
        GROUP BY DATE_FORMAT(record_date, '%Y-%m-%d')
        ORDER BY date
    """)
    List<Map<String, Object>> statsByMonth(@Param("userId") Long userId, @Param("month") String month);

    // ✅ 年度统计：统计每月平均心情
    @Select("""
        SELECT 
            DATE_FORMAT(record_date, '%Y-%m') AS date,
            ROUND(AVG(mood_score), 2) AS moodScore
        FROM mood_record
        WHERE user_id = #{userId}
          AND DATE_FORMAT(record_date, '%Y') = #{year}
        GROUP BY DATE_FORMAT(record_date, '%Y-%m')
        ORDER BY date
    """)
    List<Map<String, Object>> statsByYear(@Param("userId") Long userId, @Param("year") String year);

    // 当天每条记录的时间和心情。
    @Select("""
    SELECT
        DATE_FORMAT(created_at, '%H:%i') AS time,  -- 只取时分
        mood_score AS moodScore
    FROM mood_record
    WHERE user_id = #{userId}
      AND record_date = #{date}
    ORDER BY created_at
""")
    List<Map<String, Object>> statsByDay(@Param("userId") Long userId, @Param("date") String date);


    @Select("""
    SELECT COUNT(*) FROM mood_record
    WHERE user_id = #{userId}
      AND record_date = #{date}
""")
    int countTodayMoods(@Param("userId") Long userId, @Param("date") LocalDate date);

}
