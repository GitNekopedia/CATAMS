import React from 'react';
import { Row, Col, Statistic, Typography } from 'antd';
import Mood = API.Mood;

const { Title } = Typography;

interface Props {
  summary: {
    avgMood: number;
    maxMoodDay: Mood | null;
    minMoodDay: Mood | null;
    streakDays: number;
  };
}

const MoodOverview: React.FC<Props> = ({ summary }) => {
  const { avgMood, maxMoodDay, minMoodDay, streakDays } = summary;

  const getMoodColor = (val: number) => {
    if (val >= 0.3) return '#52c41a'; // 绿
    if (val <= -0.3) return '#ff4d4f'; // 红
    return '#faad14'; // 黄
  };

  const getMoodEmoji = (val: number) => {
    if (val >= 0.6) return '😁';
    if (val >= 0.3) return '🙂';
    if (val <= -0.6) return '😭';
    if (val <= -0.3) return '😕';
    return '😐';
  };

  return (
    <div style={{ padding: '8px 4px' }}>
      <Title
        level={4}
        style={{
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        🌤 本月心情概况
      </Title>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="平均心情值"
            value={`${avgMood.toFixed(2)} ${getMoodEmoji(avgMood)}`}
            valueStyle={{ color: getMoodColor(avgMood), fontWeight: 500 }}
          />
        </Col>

        <Col span={12}>
          <Statistic
            title="连续打卡天数"
            value={streakDays}
            suffix=" 天"
            valueStyle={{ color: '#1890ff', fontWeight: 500 }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Statistic
            title="最开心的一天 😄"
            value={maxMoodDay?.recordDate || '-'}
            suffix={maxMoodDay ? ` (${maxMoodDay.moodScore.toFixed(2)})` : ''}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>

        <Col span={12}>
          <Statistic
            title="最低落的一天 😢"
            value={minMoodDay?.recordDate || '-'}
            suffix={minMoodDay ? ` (${minMoodDay.moodScore.toFixed(2)})` : ''}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MoodOverview;
