declare namespace API {
  type CourseUnit = {
    id: number;
    code: string;
    name: string;
    totalBudgetHours: number;
    remainingBudget: number;
  };

  type WorkEntry = {
    id: number;
    unitName: string;
    weekStart: string;
    hours: number;
    status: string;
  };

  export type StatData = {
    workCount: number;
    remainingBudget: number;
    approvalProgress: number; // 小数，前端显示可乘以100加上 %
  };

  type CurrentUser = {
    id: number;
    name: string;
    role: string;
  }

  type LoginResult = {
    token: string;
    user: {
      id: number;
      name: string;
      role: string;
    };
  };


  type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
  };
}
