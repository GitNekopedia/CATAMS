package com.usyd.catams.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(reg -> reg
                        .requestMatchers("/v3/api-docs/**","/swagger-ui/**","/actuator/**").permitAll()
                        .anyRequest().permitAll())
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
