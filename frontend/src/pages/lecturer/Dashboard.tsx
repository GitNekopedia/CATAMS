import { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { useIntl } from '@umijs/max';
import DashboardLayout from '@/components/common/DashboardLayout';
import StatCards from '@/components/common/StatCards';
import PendingApprovals from '@/components/common/PendingApprovals';
import {
  getLecturerCourses,
  getLecturerEntries,
  getLecturerStats,
  getPendingApprovals,
} from '@/services/dashboard';
import TopBannerLecturer from '@/components/common/TopBanner/TopBannerLecturer';
import CourseCardsLecturer from '@/components/common/CourseCards/CourseCardsLecturer';
import ActivityLecturer from '@/components/common/Activity/ActivityLecturer';

const LecturerDashboard: React.FC = () => {
  const intl = useIntl();
  const [courses, setCourses] = useState<API.LecturerCourse[]>([]);
  const [entries, setEntries] = useState<API.LecturerPendingWorkEntry[]>([]);
  const [stats, setStats] = useState<API.StatData>({
    workCount: 0,
    remainingBudget: 0,
    approvalProgress: 0,
  });
  const [approvals, setApprovals] = useState<API.LecturerPendingWorkEntry[]>([]);

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
      message.error(intl.formatMessage({ id: 'dashboard.loadFail' }));
    }
  };

  return (
    <DashboardLayout
      topBanner={
        <div style={{ marginBottom: 24 }}>
          <TopBannerLecturer courses={courses} />
        </div>
      }
      main={
        <>
          <CourseCardsLecturer courses={courses} />
          <ActivityLecturer entries={entries} />
        </>
      }
      side={
        <>
          <StatCards stats={stats} />
          <PendingApprovals approvals={approvals} />
        </>
      }
    />
  );

};

export default LecturerDashboard;
