package com.usyd.catams.application.service;

import com.usyd.catams.adapter.persistence.UnitAssignmentMapper;
import com.usyd.catams.adapter.web.dto.UnitAssignmentDTO;
import com.usyd.catams.domain.model.UnitAssignment;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnitAssignmentService {

    private final UnitAssignmentMapper mapper;

    public UnitAssignmentService(UnitAssignmentMapper mapper) {
        this.mapper = mapper;
    }

    /** 查询分配列表 */
    public List<UnitAssignmentDTO> list(Long unitId, String role, String semester, String keyword) {
        return mapper.selectAssignments(unitId, role, semester, keyword);
    }

    /** 新建分配 */
    public Long create(UnitAssignment entity) {
        mapper.insert(entity);
        return entity.getId();
    }

    /** 更新分配 */
    public void update(UnitAssignment entity) {
        mapper.update(entity);
    }

    /** 删除分配 */
    public void delete(Long id) {
        mapper.delete(id);
    }

    /** 查询某门课程下的所有分配 */
    public List<UnitAssignmentDTO> getByCourse(Long unitId) {
        return mapper.selectByCourseId(unitId);
    }
}
