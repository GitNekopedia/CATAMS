package com.usyd.catams.adapter.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class LoginResponse {
    private String token;
    private UserDTO user;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class UserDTO {
        private Long id;
        private String name;
        private String role;
    }
}
