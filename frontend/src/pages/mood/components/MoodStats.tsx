import React, { useEffect, useMemo, useState } from 'react';
import { Card, Space, DatePicker, Button, Empty, Typography, message } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
} from 'recharts';
import dayjs from 'dayjs';
import { getMoodStats, getMoodOfDay } from '@/services/mood/mood';
import {formatLocalTime} from "@/pages/mood/components/moodUtils";
import MoodPoint = API.MoodPoint;
import MoodStat = API.MoodStat;

interface MoodStatsProps {
  refreshKey?: number;
}

const { Text } = Typography;

/** 🎯 Tooltip 展示心情详情 */
const CustomTooltip = ({
                         active,
                         payload,
                         label,
                         avgMood,
                       }: {
  active?: boolean;
  payload?: any[];
  label?: string;
  avgMood: number;
}) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    let emoji = '😐';
    if (score >= 0.6) emoji = '😁';
    else if (score >= 0.2) emoji = '🙂';
    else if (score <= -0.5) emoji = '😭';
    else if (score < 0) emoji = '😕';

    const avgEmoji =
      avgMood >= 0.5 ? '😄' : avgMood >= 0.2 ? '🙂' : avgMood <= -0.3 ? '😢' : '😐';

    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '10px 12px',
          borderRadius: 10,
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          fontSize: 13,
          minWidth: 140,
        }}
      >
        <Text strong>{label}</Text>
        <div style={{ marginTop: 4 }}>
          心情：<b>{score.toFixed(2)}</b> {emoji}
        </div>
        <div style={{ color: '#999', marginTop: 2 }}>
          平均：{avgMood.toFixed(2)} {avgEmoji}
        </div>
      </div>
    );
  }
  return null;
};

/** 📈 主组件：MoodStats */
const MoodStats: React.FC<MoodStatsProps> = ({ refreshKey = 0 }) => {

  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('month');
  const [records, setRecords] = useState<(MoodStat | MoodPoint)[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  /** 🔄 加载后端数据 */
  const loadData = async (mode: 'day' | 'month' | 'year', date: dayjs.Dayjs) => {
    setLoading(true);
    try {
      if (mode === 'day') {
        const data = await getMoodOfDay(date.format('YYYY-MM-DD'));
        const normalized = data
          .map((r: any) => ({
            time: dayjs.utc(r.createdAt).local().valueOf(),
            label: formatLocalTime(r.createdAt, 'HH:mm'),
            moodScore: r.moodScore,
            description: r.description,
          }))
          .sort((a: { time: number }, b: { time: number }) => a.time - b.time); // ✅ 按时间升序
        setRecords(normalized);
        return;
      }


      // ✅ 月 / 年统计依旧用 stats
      const param =
        mode === 'year'
          ? date.format('YYYY')
          : date.format('YYYY-MM');

      const data: MoodStat[] = await getMoodStats(mode, param);
      setRecords(data);

    } catch {
      message.error('加载趋势数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(viewMode, selectedDate);
  }, [refreshKey]); // ✅ 监听刷新信号变化

  /** 模式切换 */
  const toggleMode = () => {
    const next =
      viewMode === 'month' ? 'year' : viewMode === 'year' ? 'day' : 'month';
    setViewMode(next);
    loadData(next, selectedDate);
  };

  const handleDateChange = (v: dayjs.Dayjs | null) => {
    if (!v) return;
    setSelectedDate(v);
    loadData(viewMode, v);
  };

  /** 平均心情 */
  const avgMood =
    records.length > 0
      ? records.reduce((sum, d) => sum + d.moodScore, 0) / records.length
      : 0;

  const getLineColor = (val: number) => {
    if (val > 0.3) return '#52c41a';
    if (val < -0.3) return '#ff4d4f';
    return '#faad14';
  };
  const lineColor = getLineColor(avgMood);
  const gradientId = 'moodGradient';

  /** 格式化 X 轴数据 */
  const displayData = useMemo(() => {
    if (viewMode === 'year') {
      return records.map((r) => ({
        date: dayjs(r.date).format('MM月'),
        moodScore: r.moodScore,
      }));
    }
    if (viewMode === 'month') {
      return records.map((r) => ({
        date: dayjs(r.date).format('MM-DD'),
        moodScore: r.moodScore,
      }));
    }
    // 🔸每日模式
    // 🔸每日模式
    return (records as MoodPoint[]).map((r) => ({
      date: r.label, // ✅ 用 date 字段存 "HH:mm"
      moodScore: r.moodScore,
      emoji:
        r.moodScore >= 0.6
          ? '😁'
          : r.moodScore >= 0.2
            ? '🙂'
            : r.moodScore <= -0.5
              ? '😭'
              : r.moodScore < 0
                ? '😕'
                : '😐',
    }));

  }, [records, viewMode]);

  return (
    <Card
      size="small"
      variant="borderless"
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }}
      loading={loading}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <DatePicker
            picker={viewMode === 'year' ? 'year' : viewMode === 'month' ? 'month' : 'date'}
            onChange={handleDateChange}
            allowClear={false}
            value={selectedDate}
            size="small"
          />
          <Button size="small" onClick={toggleMode}>
            {viewMode === 'month'
              ? '查看年度趋势'
              : viewMode === 'year'
                ? '查看每日变化'
                : '查看月度趋势'}
          </Button>
        </Space>

        {displayData.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={displayData}
              margin={{ top: 10, right: 20, left: 5, bottom: 10 }}
            >
              {/* 渐变色定义 */}
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  {/* 🔸 晚间色调柔和一点 */}
                  <stop offset="0%" stopColor="#FFA500" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#FFD700" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#87CEFA" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"        // ✅ 所有模式统一用 date
                type="category"
                tick={{ fontSize: 12 }}
              />

              <YAxis domain={[-1, 1]} tick={{ fontSize: 12 }} width={35} />
              <Tooltip content={<CustomTooltip avgMood={avgMood} />} />

              {/* 折线 */}
              <Line
                type="monotone"
                dataKey="moodScore"
                stroke={`url(#${gradientId})`}
                strokeWidth={3}
                dot={false}
              />

              {/* 🔸每日模式：显示 emoji 标记 */}
              {viewMode === 'day' && (
                <Scatter
                  data={displayData}
                  dataKey="moodScore"
                  fill="#8884d8"
                  shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={20}
                      >
                        {payload.emoji}
                      </text>
                    );
                  }}
                />
              )}

              <ReferenceLine
                y={avgMood}
                stroke={lineColor}
                strokeDasharray="4 4"
                label={({ viewBox }) => {
                  const { y } = viewBox as any;
                  return (
                    <text
                      x="99%"
                      y={y - 5}
                      textAnchor="end"
                      fill={lineColor}
                      fontSize={12}
                    >
                      avg {avgMood.toFixed(2)}
                    </text>
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Empty
            description="暂无心情数据"
            imageStyle={{ height: 100 }}
            style={{ marginTop: 30 }}
          />
        )}
      </Space>
    </Card>
  );
};

export default MoodStats;
