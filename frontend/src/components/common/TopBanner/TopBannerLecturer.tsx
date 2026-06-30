import TopBannerBase from './TopBannerBase';
import LecturerOverView = API.LecturerOverView;

type Props = {
  overview: LecturerOverView | null;
};

const TopBannerLecturer: React.FC<Props> = ({ overview }) => {
  return <TopBannerBase role="LECTURER" overview={overview} />;
};

export default TopBannerLecturer;
