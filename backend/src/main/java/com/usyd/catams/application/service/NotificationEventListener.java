package com.usyd.catams.application.service;

import com.usyd.catams.adapter.persistence.UserMapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.application.event.TaskAllocatedEvent;
import com.usyd.catams.application.event.TaskDeletedEvent;
import com.usyd.catams.application.event.TaskUpdatedEvent;
import com.usyd.catams.application.event.WorkEntrySubmittedEvent;
import com.usyd.catams.domain.model.UserEntity;
import com.usyd.catams.infrastructure.messaging.MailQueueProducer;
import com.usyd.catams.infrastructure.messaging.dto.MailMessageDTO;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

import java.util.List;

@Component
public class NotificationEventListener {

    private final MailQueueProducer mailQueueProducer;
    private final UserMapper userMapper;
    private final WorkEntryMapper workEntryMapper;


    public NotificationEventListener(MailQueueProducer mailQueueProducer, UserMapper userMapper, WorkEntryMapper workEntryMapper) {
        this.mailQueueProducer = mailQueueProducer;
        this.userMapper = userMapper;
        this.workEntryMapper = workEntryMapper;
    }

    /**
     * 在事务提交后触发（保证数据库成功写入后才发 MQ）
     */
    // 1️⃣ 监听任务分配
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onTaskAllocated(TaskAllocatedEvent event) {
        String lecturerName = userMapper.findNameById(event.getLecturerId());
        String tutorEmail = userMapper.findEmailById(event.getTutorId());
        MailMessageDTO mail  = new MailMessageDTO();
        mail.setTo(tutorEmail);
        mail.setSubject("New Task Allocation Notification");
        mail.setContent(String.format("""
                        Dear Tutor,

                        Lecturer %s has assigned %d new tasks to you.
                        Please check your dashboard for details.

                        Regards,
                        CATAMS System""",
                lecturerName, event.getAllocationCount()
        ));

        mailQueueProducer.enqueueMailMessage(mail);

        System.out.printf("📩 [EventListener] Queued mail to %s (lecturer=%s)%n",
                tutorEmail, lecturerName);    }

    // 2️⃣ 监听任务更新
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onTaskUpdated(TaskUpdatedEvent event) {
        String updaterName = userMapper.findNameById(event.getUpdatedBy());

        MailMessageDTO mail = new MailMessageDTO();
        mail.setTo("1842640660@qq.com"); // 测试邮箱
        mail.setSubject("Task Hours Updated Notification");
        mail.setContent(String.format("""
                Dear Tutor,

                Your task (ID: %d) has been updated to %.2f planned hours
                by %s. Please check your task summary for confirmation.

                Regards,
                CATAMS System
                """, event.getTaskId(), event.getPlannedHours(), updaterName));

        mailQueueProducer.enqueueMailMessage(mail);

        System.out.printf("📩 [EventListener] Queued task update mail (taskId=%d, updater=%s)%n",
                event.getTaskId(), updaterName);
    }

    // 3️⃣ 监听任务删除
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onTaskDeleted(TaskDeletedEvent event) {
        String tutorName = userMapper.findNameById(event.getTutorId());
        String tutorEmail = userMapper.findEmailById(event.getTutorId());
        MailMessageDTO mail = new MailMessageDTO();
        mail.setTo(tutorEmail);
        mail.setSubject("Task Deletion Notification");
        mail.setContent(String.format("""
                Dear Tutor %s,

                One of your assigned tasks (ID: %d) has been deleted.
                Please review your task list to confirm current assignments.

                Regards,
                CATAMS System
                """, tutorName, event.getTaskId()));

        mailQueueProducer.enqueueMailMessage(mail);

        System.out.printf("📩 [EventListener] Queued task deletion mail for tutor=%s (taskId=%d)%n",
                tutorName, event.getTaskId());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onWorkEntrySubmitted(WorkEntrySubmittedEvent event) {
        String tutorName = userMapper.findNameById(event.getTutorId());
        List<Long> lecturerIds = workEntryMapper.findLecturerIdByWorkEntryId(event.getWorkEntryId());
        List<String> lecturerEmails = userMapper.findEmailsByIds(lecturerIds);
        for (String email : lecturerEmails) {
            MailMessageDTO mail = new MailMessageDTO();
            mail.setTo(email);
            mail.setSubject("Work Entry Submission Notification");
            mail.setContent(String.format("""
                Dear Lecturer,

                Tutor %s has submitted a new work entry (ID: %d).
                Please review and approve it in the CATAMS.

                Regards,
                CATAMS System
                """, tutorName, event.getWorkEntryId()));

            mailQueueProducer.enqueueMailMessage(mail);
            System.out.printf("📩 [EventListener] Queued mail to %s for workEntry=%d%n",
                    email, event.getWorkEntryId());
        }
    }
}
