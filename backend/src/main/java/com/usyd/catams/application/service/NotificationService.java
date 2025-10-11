package com.usyd.catams.application.service;

import com.usyd.catams.application.event.TaskAllocatedEvent;
import com.usyd.catams.application.event.TaskDeletedEvent;
import com.usyd.catams.application.event.TaskUpdatedEvent;
import com.usyd.catams.application.event.WorkEntrySubmittedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final ApplicationEventPublisher publisher;

    public NotificationService(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    /**
     * 发布任务分配事件
     */
    public void publishTaskAllocation(Long lecturerId, Long tutorId, int count) {
        TaskAllocatedEvent event = new TaskAllocatedEvent(this, lecturerId, tutorId, count);
        publisher.publishEvent(event);
        System.out.printf("📨 Published TaskAllocatedEvent: lecturer=%d, tutor=%d, count=%d%n",
                lecturerId, tutorId, count);
    }

    public void publishTaskUpdated(Long id, double plannedHours, Long updatedBy) {
        TaskUpdatedEvent event = new TaskUpdatedEvent(this, id, plannedHours, updatedBy);
        publisher.publishEvent(event);
        System.out.printf("📨 Published TaskUpdatedEvent: id=%d, plannedHours=%.2f, updatedBy=%d%n",
                id, plannedHours, updatedBy);
    }

    public void publishTaskDeleted(Long tutorId, Long taskId) {
        TaskDeletedEvent event = new TaskDeletedEvent(this, tutorId, taskId);
        publisher.publishEvent(event);
        System.out.printf("📨 Published TaskDeletedEvent: tutor=%d, task=%d%n",
                tutorId, taskId);
    }

    public void publishWorkEntrySubmitted(Long tutorId, Long workEntryId, Long taskId) {
        WorkEntrySubmittedEvent event = new WorkEntrySubmittedEvent(this, tutorId, workEntryId, taskId);
        publisher.publishEvent(event);
        System.out.printf("📨 Published publishWorkEntrySubmitted: tutor=%d task=%d%n",
                tutorId, taskId);
    }
}
