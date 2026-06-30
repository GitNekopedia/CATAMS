import {useEffect, useState} from 'react';
import {message} from 'antd';
import {useIntl} from '@umijs/max';
import {getTutorCourses, getRecentEntries, getStats, submitWorkEntry} from '@/services/dashboard';
import DashboardLayout from '@/components/common/DashboardLayout';
import StatCards from '@/components/common/StatCards';
import TopBannerTutor from "@/components/common/TopBanner/TopBannerTutor";
import CourseCardsTutor from "@/components/common/CourseCards/CourseCardsTutor";
import ActivityTutor from "@/components/common/Activity/ActivityTutor";
import {getTutorOverview} from "@/services/tutor/dashboardService";

const TutorDashboard: React.FC = () => {
  const intl = useIntl();
  const [courses, setCourses] = useState<API.TutorCourse[]>([]);
  const [entries, setEntries] = useState<API.WorkEntry[]>([]);
  const [overview, setOverview] = useState<API.TutorOverView | null>(null);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, entryRes, overviewRes] = await Promise.all([
        getTutorCourses(),
        getRecentEntries(),
        getTutorOverview(),
      ]);

      // ✅ 现在返回的都是纯 data
      setCourses(courseRes || []);
      setEntries(entryRes || []);
      setOverview(overviewRes || null);
    } catch (err) {
      console.error(err);
      message.error(intl.formatMessage({ id: 'dashboard.loadFail' }));
    }
  };

  const handleCreate = async (payload: API.WorkEntrySubmitRequest) => {
    try {
      await submitWorkEntry(payload);
      message.success(intl.formatMessage({ id: 'activity.tutor.submitSuccess' }));
      fetchData(); // ✅ 刷新数据
    } catch (err: any) {
      // 重复提交的业务错误：在 transformResponse 里已经 toast 过了，这里可以不用再弹
      if (err?.code === 'WKE-002' || err?.message === 'WORK_ENTRY_DUPLICATE') {
        // 不再额外弹 “submitFail”
        return;
      }

      // 其它错误，统一提示“提交失败”
      message.error(intl.formatMessage({ id: 'activity.tutor.submitFail' }));
      // 可以按需 console 一下
      console.error(err);
      // 抛回去让子组件感知失败（这样 Modal 不会被关）
      throw err;
    }
  };

  return (
    <DashboardLayout
      topBanner={
        <div style={{marginBottom: 24}}>
          <TopBannerTutor overview={overview} />
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
      side={overview && <StatCards overview={overview} role={'TUTOR'} />}
    />
  );
};

export default TutorDashboard;
