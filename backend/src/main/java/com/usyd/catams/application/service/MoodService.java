package com.usyd.catams.application.service;

import com.usyd.catams.adapter.persistence.MoodRecordMapper;
import com.usyd.catams.domain.model.MoodRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MoodService {

    private final MoodRecordMapper mapper;

    /** ✅ 记录心情，可指定日期 */
    public void recordMood(Long userId, double score, String desc, LocalDate recordDate) {
        MoodRecord moodRecord = new MoodRecord();
        moodRecord.setUserId(userId);
        moodRecord.setMoodScore(score);
        moodRecord.setDescription(desc);
        moodRecord.setRecordDate(recordDate);
        mapper.insert(moodRecord);
    }

    /** ✅ 查询用户心情列表 */
    public List<MoodRecord> listMoods(Long userId) {
        return mapper.listByUser(userId);
    }

    /** ✅ 查询当天 mood 变化曲线 */
    public List<MoodRecord> getMoodRecordsOfDay(Long userId, LocalDate date) {
        return mapper.findAllOfDay(userId, date);
    }

    /** ✅ 查询当天最新一条记录（展示用） */
    public MoodRecord getLatestMoodOfDay(Long userId, LocalDate date) {
        return mapper.findLatestOfDay(userId, date);
    }

    /** ✅ 查询心情趋势（按日 / 月 / 年） */
    public List<Map<String, Object>> getMoodStats(Long userId, String type, String date) {
        if ("day".equalsIgnoreCase(type)) {
            return mapper.statsByDay(userId, date);
        }
        else if ("month".equalsIgnoreCase(type)) {
            // 例如 date = "2025-11"
            return mapper.statsByMonth(userId, date);
        }
        else {
            // 例如 date = "2025"
            return mapper.statsByYear(userId, date);
        }
    }
}
