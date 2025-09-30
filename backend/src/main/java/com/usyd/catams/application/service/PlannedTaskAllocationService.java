package com.usyd.catams.application.service;

import com.usyd.catams.adapter.web.dto.AllocationResponse;
import com.usyd.catams.adapter.web.dto.WeekHoursDTO;

import java.util.List;

public interface PlannedTaskAllocationService {

    /**
     * 查询某门课下所有任务分配
     * @param unitId 课程 ID
     * @return 分配详情列表
     */
    List<AllocationResponse> listAllocationsByUnit(Long unitId);

    /**
     * 保存/覆盖某个 tutor 的分配（批量提交）
     * @param unitId   课程 ID
     * @param tutorId  Tutor ID
     * @param allocations 前端传来的 {taskId, weekHours} 列表
     * @param createdBy 当前操作人 ID（lecturer/admin）
     */
    void saveTutorAllocations(Long unitId, Long tutorId,
                              List<WeekHoursDTO> allocations,
                              Long createdBy);

    /**
     * 更新某条分配记录的工时
     * @param id 分配记录 ID
     * @param plannedHours 新的工时
     * @param updatedBy 操作人 ID
     */
    void updateAllocationHours(Long id, double plannedHours, Long updatedBy);

    /**
     * 删除某条分配记录
     * @param tutorId tutor ID
     * @param taskId 任务 ID
     */

    void deleteByTutorAndTask(Long tutorId, Long taskId);
}
