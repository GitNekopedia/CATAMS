package com.usyd.catams.application.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskDeletedEvent extends ApplicationEvent {
    private final Long tutorId;
    private final Long taskId;

    public TaskDeletedEvent(Object source, Long tutorId, Long taskId) {
        super(source);
        this.tutorId = tutorId;
        this.taskId = taskId;
    }

}
