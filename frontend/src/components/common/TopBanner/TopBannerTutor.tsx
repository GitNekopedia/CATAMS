import TopBannerBase from './TopBannerBase';
import TutorCourse = API.TutorCourse;

type Props = {
  courses: TutorCourse[];
};

const TopBannerTutor: React.FC<Props> = ({ courses }) => {
  return <TopBannerBase role="TUTOR" coursesCount={courses.length} />;
};

export default TopBannerTutor;
