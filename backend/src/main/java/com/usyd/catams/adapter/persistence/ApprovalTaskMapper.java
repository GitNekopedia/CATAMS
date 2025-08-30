package com.usyd.catams.adapter.persistence;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.domain.model.ApprovalTask;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ApprovalTaskMapper extends BaseMapper<ApprovalTask> {}
