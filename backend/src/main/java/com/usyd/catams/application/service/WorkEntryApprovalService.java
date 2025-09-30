package com.usyd.catams.application.service;

import com.usyd.catams.adapter.persistence.ApprovalTaskMapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.adapter.web.dto.WorkEntryDTO;
import com.usyd.catams.infrastructure.cache.RedisWorkEntryCache;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkEntryApprovalService {
    private final WorkEntryMapper workEntryMapper;
    private final ApprovalTaskMapper approvalTaskMapper;
    private final RedisWorkEntryCache weCache;

    public WorkEntryApprovalService(WorkEntryMapper w, ApprovalTaskMapper a, RedisWorkEntryCache c) {
        this.workEntryMapper = w; this.approvalTaskMapper = a; this.weCache = c;
    }

    @Transactional
    public void approve(Long entryId, Long actorId, String comment) {
        var e = workEntryMapper.findById(entryId);
        e.setStatus(com.usyd.catams.domain.enums.WorkStatus.FINAL_APPROVED);
        workEntryMapper.updateById(e);

        var log = new com.usyd.catams.domain.model.ApprovalTask();
        log.setEntryId(entryId);
        log.setStep(com.usyd.catams.domain.enums.ApprovalStep.LECTURER);
        log.setAction(com.usyd.catams.domain.enums.Action.APPROVE);
        log.setActorId(actorId);
        log.setComment(comment);
        approvalTaskMapper.insert(log);

        weCache.removePending(entryId);
        weCache.evictEntryDTO(entryId);
    }

    @Transactional
    public void reject(Long entryId, Long actorId, String comment) {
        var e = workEntryMapper.findById(entryId);
        e.setStatus(com.usyd.catams.domain.enums.WorkStatus.REJECTED);
        workEntryMapper.updateById(e);

        var log = new com.usyd.catams.domain.model.ApprovalTask();
        log.setEntryId(entryId);
        log.setStep(com.usyd.catams.domain.enums.ApprovalStep.LECTURER);
        log.setAction(com.usyd.catams.domain.enums.Action.REJECT);
        log.setActorId(actorId);
        log.setComment(comment);
        approvalTaskMapper.insert(log);

        weCache.removePending(entryId);
        weCache.evictEntryDTO(entryId);
    }

    public List<WorkEntryDTO> findLecturerPending(Long id) {
        approvalTaskMapper.findPendingByLecturer(id);
        return null;
    }
}
