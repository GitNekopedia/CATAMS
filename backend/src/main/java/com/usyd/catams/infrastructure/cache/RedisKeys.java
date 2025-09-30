package com.usyd.catams.infrastructure.cache;

public final class RedisKeys {
    private RedisKeys(){}

    public static String unit(Long unitId) { return "unit:" + unitId; } // 课程元数据缓存
    public static String userName(Long userId) { return "user:name:" + userId; }

    public static String weIdem(Long tutorId, Long unitId, String weekStart) {
        return "we:idem:" + tutorId + ":" + unitId + ":" + weekStart;
    }

    public static String weRecentTutor(Long tutorId) { return "we:recent:tutor:" + tutorId; } // ZSET
    public static String wePending() { return "we:pending"; } // SET 或 ZSET
    public static String weEntry(Long id) { return "we:entry:" + id; } // DTO 缓存
    public static String rlSubmit(Long tutorId) { return "rl:submit:" + tutorId; } // 限流
}
