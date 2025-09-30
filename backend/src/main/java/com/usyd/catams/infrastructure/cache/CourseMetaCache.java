package com.usyd.catams.infrastructure.cache;

import com.usyd.catams.adapter.persistence.CourseUnitMapper;
import com.usyd.catams.domain.model.CourseUnit;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import java.time.Duration;

@Component
public class CourseMetaCache {
    private final StringRedisTemplate str;
    private final CourseUnitMapper courseUnitMapper;

    public CourseMetaCache(StringRedisTemplate str, CourseUnitMapper m) {
        this.str = str; this.courseUnitMapper = m;
    }

    public CourseUnit getById(Long unitId) {
        String key = RedisKeys.unit(unitId);
        String json = str.opsForValue().get(key);
        if (json != null) {
            return Jsons.fromJson(json, CourseUnit.class);
        }
        CourseUnit db = courseUnitMapper.findById(unitId);
        if (db != null) {
            str.opsForValue().set(key, Jsons.toJson(db), Duration.ofHours(24));
        }
        return db;
    }

    public void evict(Long unitId) {
        str.delete(RedisKeys.unit(unitId));
    }
}
