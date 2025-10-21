package com.usyd.catams.application.query;
import com.usyd.catams.adapter.persistence.CourseUnitMapper;
import com.usyd.catams.adapter.persistence.UnitAssignmentMapper;
import com.usyd.catams.adapter.web.dto.*;

import com.usyd.catams.domain.model.CourseUnit;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class CourseQueryService {

    private final UnitAssignmentMapper unitAssignmentMapper;
    private final CourseUnitMapper courseUnitMapper;

    public CourseQueryService(UnitAssignmentMapper unitAssignmentMapper, CourseUnitMapper courseUnitMapper) {
        this.unitAssignmentMapper = unitAssignmentMapper;
        this.courseUnitMapper = courseUnitMapper;
    }

    /**
     * 查询某个 tutor 被分配的课程（带代码和名称）
     */
    public List<TutorCourseDTO> findTutorCourses(Long tutorId) {
        return unitAssignmentMapper.findTutorCourses(tutorId);
    }

    public List<LecturerCourseDTO> findLecturerCourses(Long id) {
        return unitAssignmentMapper.findLecturerCourses(id);
    }

    public List<TutorOfCourseDTO> getTutorsOfTheCourse(Long unitId){
        return unitAssignmentMapper.getTutorsOfTheCourse(unitId);
    }

    /** 分页+条件+排序查询 */
    public Map<String, Object> listPaged(String code, String name, String semester,
                                         Double minBudget, Double maxBudget,
                                         String startDate, String endDate,
                                         int page, int pageSize,
                                         String sortField, String sortOrder) {
        int offset = (page - 1) * pageSize;
        String safeField = courseUnitMapper.getSafeSortField(sortField);
        String safeOrder = "ASC".equalsIgnoreCase(sortOrder) ? "ASC"
                : "DESC".equalsIgnoreCase(sortOrder) ? "DESC" : "DESC";

        List<CourseUnitDTO> list = courseUnitMapper.selectPaged(code, name, semester, minBudget, maxBudget,
                startDate, endDate, offset, pageSize, safeField, safeOrder);

        long total = courseUnitMapper.countByCondition(code, name, semester, minBudget, maxBudget, startDate, endDate);

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", total);
        return result;
    }

    /** 创建课程 */
    public Long create(CourseUnitDTO dto) {
        CourseUnit entity = new CourseUnit();
        entity.setCode(dto.getCode());
        entity.setName(dto.getName());
        entity.setSemester(dto.getSemester());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setTotalBudgetHours(dto.getTotalBudgetHours());
        entity.setRemainingBudget(dto.getRemainingBudget());
        courseUnitMapper.insert(entity);
        return entity.getId();
    }

    /** 更新课程 */
    public void update(Long id, CourseUnitDTO dto) {
        CourseUnit entity = new CourseUnit();
        entity.setId(id);
        entity.setCode(dto.getCode());
        entity.setName(dto.getName());
        entity.setSemester(dto.getSemester());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setTotalBudgetHours(dto.getTotalBudgetHours());
        entity.setRemainingBudget(dto.getRemainingBudget());
        courseUnitMapper.update(entity);
    }

    /** 删除课程 */
    public void delete(Long id) {
        courseUnitMapper.delete(id);
    }
}
