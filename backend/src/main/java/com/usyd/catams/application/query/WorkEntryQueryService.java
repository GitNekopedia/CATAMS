package com.usyd.catams.application.query;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.catams.adapter.persistence.ApprovalTaskMapper;
import com.usyd.catams.adapter.persistence.UnitAssignmentMapper;
import com.usyd.catams.adapter.persistence.UserMapper;
import com.usyd.catams.adapter.persistence.WorkEntryMapper;
import com.usyd.catams.adapter.web.dto.*;
import com.usyd.catams.domain.enums.WorkStatus;
import com.usyd.catams.domain.model.WorkEntry;
import com.usyd.catams.infrastructure.cache.RedisWorkEntryCache;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Service
public class WorkEntryQueryService {
    private final WorkEntryMapper workEntryMapper;
    private final UserMapper userMapper;
    private final RedisWorkEntryCache weCache;
    private final ApprovalTaskMapper approvalTaskMapper;
    private final UnitAssignmentMapper unitAssignmentMapper;

    public WorkEntryQueryService(WorkEntryMapper workEntryMapper, UserMapper userMapper, RedisWorkEntryCache redisWorkEntryCache, ApprovalTaskMapper approvalTaskMapper, UnitAssignmentMapper unitAssignmentMapper) {
        this.workEntryMapper = workEntryMapper;
        this.userMapper = userMapper;
        this.weCache = redisWorkEntryCache;
        this.approvalTaskMapper = approvalTaskMapper;
        this.unitAssignmentMapper = unitAssignmentMapper;
    }

    public List<WorkEntryDTO> listRecentByTutor(Long tutorId, int limit) {
        List<WorkEntryDTO> result = new ArrayList<>();

        // 直接从数据库查
        var entries = workEntryMapper.findRecentByTutor(tutorId, limit);

        for (var entry : entries) {
            var dto = toDTO(entry, "TUTOR");
            result.add(dto);
        }

        // 按时间降序排序（最新的在前）
        result.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        return result;
    }

    private void processMissIds(Set<Long> miss, List<WorkEntryDTO> result) {
        try {
            var list = workEntryMapper.findByIds(new ArrayList<>(miss));
            for (var e : list) {
                var dto = toDTO(e, "TUTOR");

                try {
                    weCache.cacheEntryDTO(dto); // 覆盖旧缓存
                } catch (Exception ex) {
                    log.warn("Failed to cache DTO", ex);
                }

                result.add(dto);
            }
        } catch (Exception e) {
            log.warn("Failed to process miss IDs from database", e);
        }
    }

    private WorkEntryDTO toDTO(WorkEntry workEntry, String role) {
        String tutorName = userMapper.findNameById(workEntry.getTutorId()); // 可加本地/redis缓存
        java.util.Set<String> actions = availableActions(role, workEntry.getStatus());
        WorkEntryDTO workEntryDTO = new WorkEntryDTO();
        workEntryDTO.setId(workEntry.getId());
        workEntryDTO.setTutorId(workEntry.getTutorId());
        workEntryDTO.setTutorName(tutorName);
        workEntryDTO.setUnitId(workEntry.getUnitId());
        workEntryDTO.setUnitCode(workEntry.getUnitCode());
        workEntryDTO.setUnitName(workEntry.getUnitName());
        workEntryDTO.setWeekStart(workEntry.getWeekStart());
        workEntryDTO.setWorkType(workEntry.getWorkType());
        workEntryDTO.setHours(workEntry.getHours());
        workEntryDTO.setDescription(workEntry.getDescription());
        workEntryDTO.setStatus(workEntry.getStatus().name());
        workEntryDTO.setPayRateSnapshot(workEntry.getPayRateSnapshot());
        workEntryDTO.setCreatedAt(workEntry.getCreatedAt());
        workEntryDTO.setUpdatedAt(workEntry.getUpdatedAt());
        workEntryDTO.setActions(actions);
        return workEntryDTO;
    }

    private Set<String> availableActions(String role, WorkStatus status) {
        if ("LECTURER".equals(role)) {
            return switch (status) {
                case SUBMITTED -> Set.of("APPROVE", "REJECT");
                default -> Set.of();
            };
        }
        if ("HR".equals(role)) {
            return switch (status) {
                case APPROVED_BY_LECTURER -> Set.of("APPROVE", "REJECT");
                default -> Set.of();
            };
        }
        return Set.of();
    }

    public List<WorkEntry> listByTutorWeek(Long tutorId, LocalDate weekStart) {
        return workEntryMapper.selectList(new LambdaQueryWrapper<WorkEntry>().eq(WorkEntry::getTutorId, tutorId).eq(WorkEntry::getWeekStart, weekStart));
    }

    public List<DetailedWorkEntryDTO> getAllTutorDetailedEntries(Long tutorId) {
        List<WorkEntryDTO> allWorkEntriesByTutorId = workEntryMapper.findAllWorkEntriesByTutorId(tutorId);
        // 2. 提取 entryIds
        List<Long> allEntryIds = allWorkEntriesByTutorId.stream().map(WorkEntryDTO::getId).toList();
        // 3. 查审批任务
        List<ApprovalTaskDTO> tasks = approvalTaskMapper.findTasksByEntryIds(allEntryIds);
        // 4. 按 entryId 分组
        Map<Long, List<ApprovalTaskDTO>> taskMap = tasks.stream()
                .collect(Collectors.groupingBy(ApprovalTaskDTO::getEntryId));

        // 5. 拼装 DTO
        return allWorkEntriesByTutorId.stream().map(e -> {
            DetailedWorkEntryDTO dto = new DetailedWorkEntryDTO();
            BeanUtils.copyProperties(e, dto);
            dto.setApprovalTasks(taskMap.getOrDefault(e.getId(), List.of()));
            return dto;
        }).toList();
    }

    public List<LecturerPendingWorkEntryDTO> listRecentByLecturer(Long id, int limit) {
        return workEntryMapper.findRecentWorkEntriesByLecturer(id, limit);
    }

    public List<DetailedLecturerPendingWorkEntryDTO> getAllLecturerDetailedEntries(Long lecturerId) {
        // 1. 查询 Lecturer 负责的课程
        List<LecturerCourseDTO> courses = unitAssignmentMapper.findLecturerCourses(lecturerId);
        if (courses.isEmpty()) {
            return List.of();
        }

        // 2. 提取课程 unitIds
        List<Long> unitIds = courses.stream()
                .map(LecturerCourseDTO::getUnitId)
                .toList();

        // 3. 查询这些课程下的工时记录
        List<LecturerPendingWorkEntryDTO> workEntries = workEntryMapper.findAllWorkEntriesByUnitIds(unitIds);
        if (workEntries.isEmpty()) {
            return List.of();
        }

        // 4. 提取 entryIds 并查审批任务
        List<Long> entryIds = workEntries.stream()
                .map(LecturerPendingWorkEntryDTO::getWorkEntryId)
                .toList();
        List<ApprovalTaskDTO> tasks = approvalTaskMapper.findTasksByEntryIds(entryIds);

        // 5. 按 entryId 分组任务
        Map<Long, List<ApprovalTaskDTO>> taskMap = tasks.stream()
                .collect(Collectors.groupingBy(ApprovalTaskDTO::getEntryId));

        // 6. 拼装详细 DTO
        return workEntries.stream()
                .map(we -> {
                    DetailedLecturerPendingWorkEntryDTO dto = new DetailedLecturerPendingWorkEntryDTO();
                    BeanUtils.copyProperties(we, dto);
                    dto.setApprovalTasks(taskMap.getOrDefault(we.getWorkEntryId(), List.of()));
                    return dto;
                })
                .toList();
    }

    public List<DetailedLecturerPendingWorkEntryDTO> getAllHRDetailedEntries(Long id) {
        // HR 不受课程限制，查看所有工时记录
        List<LecturerPendingWorkEntryDTO> workEntries = workEntryMapper.findAllWorkEntries();

        if (workEntries.isEmpty()) {
            return List.of();
        }

        // 提取 entryIds
        List<Long> entryIds = workEntries.stream()
                .map(LecturerPendingWorkEntryDTO::getWorkEntryId)
                .toList();

        // 查询所有审批任务
        List<ApprovalTaskDTO> tasks = approvalTaskMapper.findTasksByEntryIds(entryIds);
        Map<Long, List<ApprovalTaskDTO>> taskMap = tasks.stream()
                .collect(Collectors.groupingBy(ApprovalTaskDTO::getEntryId));

        // 拼装详细 DTO 列表
        return workEntries.stream()
                .map(we -> {
                    DetailedLecturerPendingWorkEntryDTO dto = new DetailedLecturerPendingWorkEntryDTO();
                    BeanUtils.copyProperties(we, dto);
                    dto.setApprovalTasks(taskMap.getOrDefault(we.getWorkEntryId(), List.of()));
                    return dto;
                })
                .toList();

    }
}
