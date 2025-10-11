package com.usyd.catams.application.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class WorkEntrySubmittedEvent extends ApplicationEvent {
    private final Long tutorId;
    private final Long taskId;
    private final Long workEntryId;

    public WorkEntrySubmittedEvent(Object source, Long tutorId, Long workEntryId, Long taskId) {
        super(source);
        this.tutorId = tutorId;
        this.workEntryId = workEntryId;
        this.taskId = taskId;
    }
}
