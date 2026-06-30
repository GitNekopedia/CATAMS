package com.usyd.catams.adapter.web.mood;

import com.usyd.catams.application.service.MoodService;
import com.usyd.catams.domain.model.MoodRecord;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.exception.BusinessCode;
import com.usyd.catams.infrastructure.exception.BusinessException;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 个人心情记录接口（私用模块）
 */
@RestController
@RequestMapping("/api/mood")
@RequiredArgsConstructor
public class MoodController {

    private final MoodService moodService;

    /** ✅ 获取当天最新一条心情记录 */
    @GetMapping("/today-latest")
    public ApiResponse<MoodRecord> getTodayLatestMood() {
        var user = AuthUserContext.get();
        var latest = moodService.getLatestMoodOfDay(user.getId(), LocalDate.now());
        return ApiResponse.ok(latest);
    }


    /** ✅ 获取今天（或指定日期）的所有心情记录 */
    @GetMapping("/day")
    public ApiResponse<List<MoodRecord>> getMoodsOfDay(
            @RequestParam(required = false) String date
    ) {
        var user = AuthUserContext.get();
        LocalDate recordDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        var moods = moodService.getMoodRecordsOfDay(user.getId(), recordDate);
        return ApiResponse.ok(moods);
    }

    /** ✅ 记录心情，可自选日期 */
    @PostMapping("/record")
    public ApiResponse<String> recordMood(
            @RequestParam double score,
            @RequestParam String desc,
            @RequestParam(required = false) String date
    ) {
        var user = AuthUserContext.get();
        LocalDate recordDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        moodService.recordMood(user.getId(), score, desc, recordDate);
        return ApiResponse.ok("心情记录成功");
    }

    /** ✅ 获取我的心情历史 */
    @GetMapping("/list")
    public ApiResponse<List<MoodRecord>> listMyMoods() {
        var user = AuthUserContext.get();
        var moods = moodService.listMoods(user.getId());
        return ApiResponse.ok(moods);
    }

    /** ✅ 按日 / 按月 / 按年统计心情趋势 */
    @GetMapping("/stats")
    public ApiResponse<?> getMoodStats(
            @RequestParam String type, // "day" | "month" | "year"
            @RequestParam String date
    ) {
        var user = AuthUserContext.get();

        List<String> validTypes = List.of("day", "month", "year");
        if (!validTypes.contains(type.toLowerCase())) {
            throw new BusinessException(BusinessCode.MOOD_TYPE_INVALID, "类型错误，只能使用'年/月/日'类型");
        }

        var stats = moodService.getMoodStats(user.getId(), type, date);
        return ApiResponse.ok(stats);
    }

}
