CREATE TABLE mood_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    mood_score DECIMAL(3,2) NOT NULL, -- -1.00 ~ 1.00
    description VARCHAR(255),
    record_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mood_user FOREIGN KEY (user_id) REFERENCES user(id)
);
