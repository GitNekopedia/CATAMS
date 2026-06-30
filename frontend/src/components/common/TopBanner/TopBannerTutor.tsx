import TopBannerBase from './TopBannerBase';
import TutorOverView = API.TutorOverView;

type Props = {
  overview: TutorOverView | null;
};

const TopBannerTutor: React.FC<Props> = ({ overview }) => {
  return <TopBannerBase role="TUTOR" overview={overview} />;
};

export default TopBannerTutor;
