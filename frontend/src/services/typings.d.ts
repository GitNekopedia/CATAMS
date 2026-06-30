declare namespace API {

  type HrOverview = {
    totalCourses: number;
    totalTutors: number;
    pendingApprovals: number;
    totalBudget: number;
  };

  type TutorIncomeDetail = {
    entryId: number;
    unitCode: string;
    unitName: string;
    taskName: string;
    weekStart: string; // 日期字符串
    hours: number;
    payRate: number;
    amount: number;
  };

  type TutorIncome = {
    tutorId: number;
    tutorName: string;
    month: string;
    totalHours: number;
    totalIncome: number;
  };

  // BaseOverview
  type BaseOverview = {
    courseCount: number;
    pendingCount: number;
    approvedCount: number;
    approvalRate: number;
  };

// Lecturer
  type LecturerOverView = BaseOverview & {
    averageBudgetUsage?: number;
    totalRemainingBudget: number;
  };

// Tutor
  type TutorOverView = BaseOverview & {
    unsubmittedWorkEntries: number;
    totalQuotaHours: number;
  };


  /** 用户表单字段 */
  type UserForm = {
    name: string;
    email: string;
    role: 'Lecturer' | 'Tutor' | 'HR' | 'Admin';
  };

  type AllocationResponse = {
    id: number;
    unitId: number;
    unitCode: string;
    unitName: string;
    tutorId: number;
    taskId: number;
    taskName: string;
    typeName: string;
    payRate: number;
    payCategory: string;
    weekStart: string;      // "2025-03-01"
    plannedHours: number;
  };

  type AllocationResponse = {
    id: number;
    unitId: number;
    tutorId: number;
    taskId: number;
    taskName: string;
    typeName: string;
    weekStart: string; // yyyy-MM-dd
    plannedHours: number;
  };

  // 每个 tutor 的提交数据
  type SaveTutorAllocationsRequest = {
    unitId: number;
    tutorId: number;
    allocations: {
      taskId: number;
      weekHours: Record<string, number>; // { "2025-08-04": 2, "2025-08-11": 0 }
      payRate: number;
      payCategory: string;
    }[];
  };

  type AllocationRow = {
    key: string;     // `${tutorId}-${taskId}`
    taskId: number;
    tutorId: number;
    taskName: string;
    typeName: string;
    weekHours: Record<string, number>; // { Week1: 0, Week2: 0, ... }
    payRate: number;
    payCategory: string;
  };

  type TaskTypeDTO = {
    id: number;
    unitId: number;
    name: string;
    phdPayRate: number;
    nonPhdPayRate: number;
    createdAt: string;
    updatedAt: string;
  };

  type TaskDTO = {
    id: number;
    unitId: number;
    typeId: number;
    name: string;
    isActive: boolean;
    phdPayRate: number;
    nonPhdPayRate: number;
    createdAt: string;
    updatedAt: string;
  };

  type TutorOfCourseDTO = {
    id: number;
    name: string;
    payRate: number;
  }

  // 审批步骤
  type ApprovalStep = 'TUTOR' | 'LECTURER' | 'HR';

  // 审批动作
  type ApprovalAction = 'SUBMIT' | 'APPROVE' | 'REJECT';

  type LecturerPendingWorkEntry = {
    workEntryId: number;     // 工时记录 ID
    tutorId: number;         // 助教 ID
    tutorName: string;       // 助教姓名

    unitId: number;          // 课程 ID
    unitCode: string;        // 课程代码
    unitName: string;        // 课程名称

    weekStart: string;       // 周起始日期 (YYYY-MM-DD)
    workType: string;        // 工作类型
    hours: number;           // 工时数
    description?: string;    // 描述
    status: string;          // 工时状态

    // 审批任务相关信息
    approvalTaskId: number;  // 审批任务 ID
    step: ApprovalStep;            // 审批步骤 (LECTURER/TUTOR/HR)
    action?: ApprovalAction;         // 审批动作 (APPROVE/REJECT/null)
    taskCreatedAt: string;   // 审批任务创建时间 (ISO 格式)
  };

  type DetailedLecturerPendingWorkEntry = {
    workEntryId: number;     // 工时记录 ID
    tutorId: number;         // 助教 ID
    tutorName: string;       // 助教姓名

    unitId: number;          // 课程 ID
    unitCode: string;        // 课程代码
    unitName: string;        // 课程名称

    weekStart: string;       // 周起始日期 (YYYY-MM-DD)
    workType: string;        // 工作类型
    hours: number;           // 工时数
    description?: string;    // 描述
    status: string;          // 工时状态

    // 审批任务相关信息
    approvalTaskId: number;  // 审批任务 ID
    step: ApprovalStep;            // 审批步骤 (LECTURER/TUTOR/HR)
    action?: ApprovalAction;         // 审批动作 (APPROVE/REJECT/null)
    taskCreatedAt: string;   // 审批任务创建时间 (ISO 格式)
    approvalTasks: ApprovalTask[];
  };

  type WorkEntrySubmitRequest = {
    originPlannedId: number;   // 对应 planned_task_allocation.id
    taskId: number;            // 对应 unit_task.id
    unitId: number;            // 冗余带上，方便后端校验
    weekStart: string;         // YYYY-MM-DD
    hours: number;             // 实际工时
    description?: string;      // 备注
    substitute: boolean;
  };

  type LecturerCourse = {
    id: number;          // unit_assignment.id
    unitId: number;      // course_unit.id
    code: string;        // course_unit.code
    name: string;        // course_unit.namez
    totalBudgetHours: number;
    remainingBudget: number;
  };

  type TutorCourse = {
    id: number;          // unit_assignment.id
    unitId: number;      // course_unit.id
    code: string;        // course_unit.code
    name: string;        // course_unit.name
    payRate: number;     // unit_assignment.pay_rate
    quotaHours: number;  // unit_assignment.quota_hours
  };

  type CourseUnit = {
    id: number;
    code: string;
    name: string;
    semester: string;
    startDate: string;
    endDate: string;
    totalBudgetHours: number;
    remainingBudget: number;
    createdAt: string;
    updatedAt: string;
  };

  type WorkEntry = {
    id: number;
    tutorId: number;
    tutorName: string;
    unitCode: string;
    unitId: number;
    unitName: string;
    weekStart: string; // YYYY-MM-DD
    workType: string;
    hours: number;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };

  type DetailedWorkEntry = {
    id: number;
    tutorId: number;
    tutorName: string;
    unitId: number;
    unitCode: string;
    unitName: string;
    weekStart: string;
    workType: string;
    hours: number;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    approvalTasks: ApprovalTask[];
  };


  export type StatData = {
    workCount: number;
    remainingBudget: number;
    approvalProgress: number; // 小数，前端显示可乘以100加上 %
  };

  type UserEntity = {
    id: number;
    name: string;
    email: string;
    role: string; // Lecturer / Tutor / HR / Admin
    createdAt: string;
    updatedAt: string;
  }

  type CurrentUser = {
    id: number;
    name: string;
    role: string;
    avatar?: string;
    email?: string;
    access?: string;
  }

  type LoginResult = {
    token: string;
    user: {
      id: number;
      name: string;
      role: string;
    };
  };


  type ApiResponse<T = any> = {
    success: boolean;
    message: string;
    data: T;
    error?: string;
  };

  type Mood = {
    id: number;
    userId: number;
    moodScore: number;
    description: string;
    recordDate: string;
    createdAt: string;
  };

  type MoodStat = {
    date: string;
    moodScore: number;
  };

  // 扩展类型：用于每日模式（包含时间戳）
  interface MoodPoint extends MoodStat {
    time: number;        // 时间戳（毫秒）
    label: string;       // 本地格式化时间
  }

}
