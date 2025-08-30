import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getTutorCourses, getRecentEntries, getStats } from '@/services/dashboard';
import DashboardLayout from '@/components/common/DashboardLayout';
import TopBanner from '@/components/common/TopBanner';
import CourseCards from '@/components/common/CourseCards';
import Activity from '@/components/common/Activity';
import StatCards from '@/components/common/StatCards';

const TutorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<API.CourseUnit[]>([]);
  const [entries, setEntries] = useState<API.WorkEntry[]>([]);
  const [stats, setStats] = useState<API.StatData>({
    workCount: 0,
    remainingBudget: 0,
    approvalProgress: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, entryRes, statRes] = await Promise.all([
        getTutorCourses(),
        getRecentEntries(),
        getStats(),
      ]);

      if (courseRes.success) setCourses(courseRes.data);
      else message.error(courseRes.message);

      if (entryRes.success) setEntries(entryRes.data);
      else message.error(entryRes.message);

      if (statRes.success) setStats(statRes.data);
      else message.error(statRes.message);

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
          <Activity entries={entries} />
        </>
      }
      side={<StatCards stats={stats} />}
    />
  );
};

export default TutorDashboard;
