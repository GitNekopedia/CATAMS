package com.usyd.catams.infrastructure.messaging.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class MailMessageDTO implements Serializable {

    private String to;
    private String subject;
    private String content;

    public MailMessageDTO() {}

    public MailMessageDTO(String to, String subject, String content) {
        this.to = to;
        this.subject = subject;
        this.content = content;
    }

    @Override
    public String toString() {
        return "MailMessageDTO{" +
                "to='" + to + '\'' +
                ", subject='" + subject + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
