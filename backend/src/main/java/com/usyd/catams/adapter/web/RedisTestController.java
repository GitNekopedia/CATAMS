package com.usyd.catams.adapter.web;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/redis")
public class RedisTestController {

    private final StringRedisTemplate redis;

    public RedisTestController(StringRedisTemplate redis) {
        this.redis = redis;
    }

    @GetMapping("/ping")
    public String ping() {
        return redis.getConnectionFactory().getConnection().ping();
    }

    @PostMapping("/set/{k}/{v}")
    public String set(@PathVariable String k, @PathVariable String v) {
        redis.opsForValue().set(k, v);
        return "OK";
    }

    @GetMapping("/get/{k}")
    public String get(@PathVariable String k) {
        return redis.opsForValue().get(k);
    }

}
