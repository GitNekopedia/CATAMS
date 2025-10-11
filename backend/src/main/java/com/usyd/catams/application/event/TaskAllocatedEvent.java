package com.usyd.catams.application.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskAllocatedEvent extends ApplicationEvent {

    private final Long lecturerId;
    private final Long tutorId;
    private final int allocationCount;

    public TaskAllocatedEvent(Object source, Long lecturerId, Long tutorId, int allocationCount) {
        super(source);
        this.lecturerId = lecturerId;
        this.tutorId = tutorId;
        this.allocationCount = allocationCount;
    }

}
