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
import {getLecturerOverview} from "@/services/lecturer/dashboardService";

const LecturerDashboard: React.FC = () => {
  const intl = useIntl();
  const [courses, setCourses] = useState<API.LecturerCourse[]>([]);
  const [entries, setEntries] = useState<API.LecturerPendingWorkEntry[]>([]);
  const [overview, setOverview] = useState<API.LecturerOverView | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // ✅ Promise.all 直接返回业务数据
      const [coursesRes, entriesRes, overviewRes] = await Promise.all([
        getLecturerCourses(),
        getLecturerEntries(),
        getLecturerOverview(),
      ]);

      setCourses(coursesRes || []);
      setEntries(entriesRes || []);
      setOverview(overviewRes || null);
    } catch (err) {
      console.error(err);
      message.error(intl.formatMessage({ id: 'dashboard.loadFail' }));
    }
  };


  return (
    <DashboardLayout
      topBanner={
        <div style={{ marginBottom: 24 }}>
          <TopBannerLecturer overview={overview} />
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
          <StatCards overview={overview} role={'LECTURER'} />
        </>
      }
    />
  );

};

export default LecturerDashboard;
