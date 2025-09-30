package com.usyd.catams.application.query;
import com.usyd.catams.adapter.persistence.UnitAssignmentMapper;
import com.usyd.catams.adapter.web.dto.LecturerCourseDTO;
import com.usyd.catams.adapter.web.dto.LoginResponse;
import com.usyd.catams.adapter.web.dto.TutorCourseDTO;

import com.usyd.catams.adapter.web.dto.TutorOfCourseDTO;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CourseQueryService {

    private final UnitAssignmentMapper unitAssignmentMapper;

    public CourseQueryService(UnitAssignmentMapper unitAssignmentMapper) {
        this.unitAssignmentMapper = unitAssignmentMapper;
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
}
