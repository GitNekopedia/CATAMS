package com.usyd.catams.infrastructure.cache;

import com.usyd.catams.adapter.web.dto.WorkEntryDTO;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class RedisWorkEntryCache {
    private final StringRedisTemplate str;

    public RedisWorkEntryCache(StringRedisTemplate str) { this.str = str; }

    // 幂等：成功 true，已存在 false
    public boolean acquireIdempotent(Long tutorId, Long unitId, String weekStart) {
        String key = RedisKeys.weIdem(tutorId, unitId, weekStart);
        Boolean ok = str.opsForValue().setIfAbsent(key, "1", Duration.ofDays(8));
        return Boolean.TRUE.equals(ok);
    }
    public void releaseIdempotent(Long tutorId, Long unitId, String weekStart) {
        str.delete(RedisKeys.weIdem(tutorId, unitId, weekStart));
    }

    // 最近列表（Tutor）——ZSET score=createdAt epoch
    public void pushTutorRecent(Long tutorId, Long entryId, java.time.LocalDateTime createdAt) {
        String key = RedisKeys.weRecentTutor(tutorId);
        long score = createdAt.atZone(ZoneId.systemDefault()).toEpochSecond();
        str.opsForZSet().add(key, entryId.toString(), score);
        str.opsForZSet().removeRange(key, 0, -101); // 只保留最近100
        str.expire(key, Duration.ofDays(7)); // 可选
    }

    public List<Long> getTutorRecentIds(Long tutorId, int limit) {
        String key = RedisKeys.weRecentTutor(tutorId);
        Set<String> ids = str.opsForZSet().reverseRange(key, 0, limit - 1);
        if (ids == null) return List.of();
        return ids.stream().map(Long::valueOf).collect(Collectors.toList());
        // 不存在/过期时，返回空 -> 退化到 DB 查询
    }

    // 待审批集合（全局或按 lecturerId 细分都可，这里用全局）
    public void addPending(Long entryId) {
        str.opsForSet().add(RedisKeys.wePending(), entryId.toString());
    }
    public void removePending(Long entryId) {
        str.opsForSet().remove(RedisKeys.wePending(), entryId.toString());
    }
    public Set<Long> getPendingIds(int limit) {
        // 简化：随机取一些；需要排序可改用 ZSET 存 createdAt
        Set<String> s = str.opsForSet().members(RedisKeys.wePending());
        if (s == null) return Set.of();
        return s.stream().limit(limit).map(Long::valueOf).collect(Collectors.toSet());
    }

    // DTO 缓存（命中则省 DB & 组装）
    public void cacheEntryDTO(WorkEntryDTO dto) {
        str.opsForValue().set(RedisKeys.weEntry(dto.getId()), Jsons.toJson(dto), Duration.ofHours(2));
    }
    public WorkEntryDTO getEntryDTO(Long id) {
        String json = str.opsForValue().get(RedisKeys.weEntry(id));
        return json == null ? null : Jsons.fromJson(json, WorkEntryDTO.class);
    }
    public void evictEntryDTO(Long id) {
        str.delete(RedisKeys.weEntry(id));
    }

    // 限流（60s 允许 5 次）
    public void rateLimitSubmit(Long tutorId) {
        String key = RedisKeys.rlSubmit(tutorId);
        long now = System.currentTimeMillis();
        str.opsForZSet().add(key, String.valueOf(now), now);
        str.opsForZSet().removeRangeByScore(key, 0, now - 60_000);
        Long count = str.opsForZSet().zCard(key);
        str.expire(key, Duration.ofMinutes(2));
        if (count != null && count > 5) {
            throw new IllegalStateException("提交过于频繁，请稍后再试");
        }
    }
}
