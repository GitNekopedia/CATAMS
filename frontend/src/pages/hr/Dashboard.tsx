import {useEffect, useState} from 'react';
import {message} from 'antd';
import {useIntl} from '@umijs/max';
import {getTutorCourses, getRecentEntries, getStats, submitWorkEntry} from '@/services/dashboard';
import DashboardLayout from '@/components/common/DashboardLayout';
import StatCards from '@/components/common/StatCards';
import TopBannerTutor from "@/components/common/TopBanner/TopBannerTutor";
import CourseCardsTutor from "@/components/common/CourseCards/CourseCardsTutor";
import ActivityTutor from "@/components/common/Activity/ActivityTutor";

const HRDashboard: React.FC = () => {
  const intl = useIntl();
  const [courses, setCourses] = useState<API.TutorCourse[]>([]);
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
      message.error(intl.formatMessage({id: 'dashboard.loadFail'}));
    }
  };

  const handleCreate = async (payload: API.WorkEntrySubmitRequest) => {
    const res = await submitWorkEntry(payload);
    if (res.success) {
      message.success(intl.formatMessage({id: 'activity.tutor.submitSuccess'}));
      fetchData(); // 刷新课程/entries/stats
    } else {
      message.error(res.message || intl.formatMessage({id: 'activity.tutor.submitFail'}));
    }
  };

  return (
    <DashboardLayout
      topBanner={
        <div style={{marginBottom: 24}}>
          <TopBannerTutor courses={courses}/>
        </div>
      }
      main={
        <>
          <CourseCardsTutor courses={courses}/>
          <ActivityTutor
            entries={entries}
            tutorCourses={courses}
            onCreate={handleCreate}
          />
        </>
      }
      side={<StatCards stats={stats}/>}
    />
  );
};

export default HRDashboard;
