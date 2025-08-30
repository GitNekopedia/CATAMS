package com.usyd.catams.adapter.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    public static <T> ApiResponse<T> ok(T data){
        return new ApiResponse<>(true, "OK", data);
    }
    public static <T> ApiResponse<T> fail(String msg){
        return new ApiResponse<>(false, msg, null);
    }
}
