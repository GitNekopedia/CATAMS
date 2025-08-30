import { useEffect, useState } from 'react';
import { message } from 'antd';
import DashboardLayout from '@/components/common/DashboardLayout';
import TopBanner from '@/components/common/TopBanner';
import CourseCards from '@/components/common/CourseCards';
import Activity from '@/components/common/Activity';
import StatCards from '@/components/common/StatCards';
import PendingApprovals from '@/components/common/PendingApprovals';
import {
  getLecturerCourses,
  getLecturerEntries,
  getLecturerStats,
  getPendingApprovals
} from '@/services/dashboard';

const LecturerDashboard: React.FC = () => {
  const [courses, setCourses] = useState<API.CourseUnit[]>([]);
  const [entries, setEntries] = useState<API.WorkEntry[]>([]);
  const [stats, setStats] = useState<API.StatData>({
    workCount: 0,
    remainingBudget: 0,
    approvalProgress: 0,
  });
  const [approvals, setApprovals] = useState<API.WorkEntry[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, entryRes, statRes, approvalRes] = await Promise.all([
        getLecturerCourses(),
        getLecturerEntries(),
        getLecturerStats(),
        getPendingApprovals(),
      ]);

      if (courseRes.success) setCourses(courseRes.data);
      else message.error(courseRes.message);

      if (entryRes.success) setEntries(entryRes.data);
      else message.error(entryRes.message);

      if (statRes.success) setStats(statRes.data);
      else message.error(statRes.message);

      if (approvalRes.success) setApprovals(approvalRes.data);
      else message.error(approvalRes.message);

    } catch (err) {
      console.error(err);
      message.error('加载数据失败');
    }
  };

  return (
    <DashboardLayout
      topBanner={<TopBanner courses={courses} />}
      main={
        <>
          <CourseCards courses={courses} />
          <Activity entries={entries} /> {/* 改成显示最近审批动作 */}
        </>
      }
      side={
        <>
          <StatCards stats={stats} />
          <div style={{ marginTop: 24 }}>
            <PendingApprovals approvals={approvals} />
          </div>
        </>
      }
    />
  );
};

export default LecturerDashboard;
