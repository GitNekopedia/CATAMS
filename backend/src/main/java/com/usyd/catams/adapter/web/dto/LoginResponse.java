package com.usyd.catams.adapter.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private UserDTO user;

    @AllArgsConstructor
    @Data
    public static class UserDTO {
        private Long id;
        private String name;
        private String role;
    }
}
