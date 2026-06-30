package com.usyd.catams.domain.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
public class MoodRecord {
    private Long id;
    private Long userId;
    private Double moodScore;
    private String description;
    private LocalDate recordDate;
    private LocalDateTime createdAt;
}
