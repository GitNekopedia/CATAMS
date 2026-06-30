declare namespace API {
  /** Tutor 年度收入趋势 DTO */
  type TutorIncomeTrend = {
    month: string;       // "2025-01"
    totalIncome: number; // 该月收入
    totalHours: number;  // 该月工时
  };
}
