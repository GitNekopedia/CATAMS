package com.usyd.catams.infrastructure.cache;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

public final class Jsons {
    private static final ObjectMapper M = new ObjectMapper()
            .registerModule(new JavaTimeModule());
    public static String toJson(Object o){ try { return M.writeValueAsString(o); } catch(Exception e){ throw new RuntimeException(e); } }
    public static <T> T fromJson(String s, Class<T> t){ try { return M.readValue(s, t); } catch(Exception e){ throw new RuntimeException(e); } }
}
