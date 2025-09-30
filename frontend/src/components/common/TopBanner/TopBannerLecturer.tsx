import TopBannerBase from './TopBannerBase';
import LecturerCourse = API.LecturerCourse;

type Props = {
  courses: LecturerCourse[];
};

const TopBannerLecturer: React.FC<Props> = ({ courses }) => {
  return <TopBannerBase role="LECTURER" coursesCount={courses.length} />;
};

export default TopBannerLecturer;
