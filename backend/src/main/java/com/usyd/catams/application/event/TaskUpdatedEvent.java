package com.usyd.catams.application.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskUpdatedEvent extends ApplicationEvent {

    private final Long taskId;
    private final double plannedHours;
    private final Long updatedBy;

    public TaskUpdatedEvent(Object source, Long taskId, double plannedHours, Long updatedBy) {
        super(source);
        this.taskId = taskId;
        this.plannedHours = plannedHours;
        this.updatedBy = updatedBy;
    }
}