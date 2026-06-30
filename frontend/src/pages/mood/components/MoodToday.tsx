import React, { useEffect, useRef, useState } from 'react';
import { Button, DatePicker, Empty, Input, Slider, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import Mood = API.Mood;
import { formatLocalTime } from '@/pages/mood/components/moodUtils';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface Props {
  /** 所有心情记录（父组件传入） */
  records: Mood[];
  /** 保存一条心情记录 */
  onSubmit: (payload: { score: number; desc: string; date: string }) => Promise<void>;
  /** 提交按钮 loading 状态 */
  loading: boolean;
}

/**
 * 今日 / 任意日期心情记录组件
 * - 支持：日期切换、历史回看、补录、当天追加记录
 * - 不直接调接口，完全依赖父组件传入的 records + onSubmit
 */
const MoodToday: React.FC<Props> = ({ records, onSubmit, loading }) => {
  /** 当前选中的日期（默认今天） */
  const [selectedDate, setSelectedDate] = useState(dayjs());
  /** 当前滑块分数 */
  const [score, setScore] = useState(0);
  /** 当前输入的心情文案 */
  const [desc, setDesc] = useState('');
  /** 当前日期是否处于“编辑 / 新增模式” */
  const [isAdding, setIsAdding] = useState(false);
  /** 有记录的所有日期集合（用于 DatePicker 上的小圆点标记） */
  const [recordDatesSet, setRecordDatesSet] = useState<Set<string>>(new Set());

  /** 滑块手柄位置，用于显示顶部气泡 */
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [bubbleLeft, setBubbleLeft] = useState('50%');

  /** 颜色渐变的 Slider 背景 */
  const sliderStyle: React.CSSProperties = {
    background:
      'linear-gradient(90deg, #6fa8dc 0%, #a2c4c9 25%, #ffd966 50%, #f6b26b 75%, #e06666 100%)',
    borderRadius: 8,
    height: 8,
  };

  /** 根据分数选择表情 */
  const moodEmoji =
    score > 0.5 ? '😁' : score > 0.1 ? '🙂' : score < -0.5 ? '😭' : score < -0.1 ? '😕' : '😐';

  /** 缺省文案生成器 */
  const getDefaultText = () => {
    if (score > 0.5) return '今天真是开心的一天！🌞';
    if (score < -0.5) return '有点丧，不过明天会更好 🌧️';
    if (score === 0) return '今天是平平无奇的一天 😐';
    return '就这样平静地度过了一天。🙂';
  };

  const selectedStr = selectedDate.format('YYYY-MM-DD');

  /** 从全部记录中筛选出当前日期的记录（按创建时间倒序） */
  const selectedRecords = records
    .filter((r) => r.recordDate === selectedStr)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const latest = selectedRecords[0] || null;

  const isToday = selectedDate.isSame(dayjs(), 'day');

  /** 当 records 变化时，更新“有记录日期集合”，用于日历打点 */
  useEffect(() => {
    const set = new Set<string>();
    records.forEach((item) => set.add(item.recordDate));
    setRecordDatesSet(set);
  }, [records]);

  /** 选中日期变化时，重置编辑状态和表单内容 */
  useEffect(() => {
    setIsAdding(false);
    setDesc('');
    setScore(0);
  }, [selectedStr]);

  /** 提交当前日期的心情记录 */
  const handleSubmit = async () => {
    const text = desc.trim() || getDefaultText();
    await onSubmit({
      score,
      desc: text,
      date: selectedStr,
    });

    // 提交成功后重置表单 & 退出编辑模式
    setDesc('');
    setIsAdding(false);
  };

  /** 监听 Slider 手柄位置，用于更新数值气泡的位置 */
  useEffect(() => {
    const handle = sliderRef.current?.querySelector('.ant-slider-handle') as HTMLElement | null;
    if (handle) setBubbleLeft(handle.style.left || '50%');
  }, [score]);

  /** 抽出通用表单（今天 & 历史补录共用） */
  const renderForm = () => (
    <>
      <div style={{ fontSize: 56, textAlign: 'center', marginBottom: 8 }}>{moodEmoji}</div>

      <div style={{ width: '100%', marginBottom: 16, position: 'relative' }} ref={sliderRef}>
        <div
          style={{
            position: 'absolute',
            top: -25,
            left: bubbleLeft,
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: '2px 8px',
            fontSize: 12,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          {score.toFixed(1)}
        </div>

        <Slider
          min={-1}
          max={1}
          step={0.1}
          value={score}
          onChange={setScore}
          tooltip={{ open: false }}
          trackStyle={{ background: 'transparent' }}
          railStyle={sliderStyle}
          handleStyle={{
            borderColor: '#FFD700',
            backgroundColor: '#FFF8DC',
            boxShadow: '0 0 4px rgba(0,0,0,0.15)',
          }}
        />
      </div>

      <TextArea
        value={desc}
        placeholder="写下这一天的心情吧..."
        onChange={(e) => setDesc(e.target.value)}
        rows={3}
        style={{ borderRadius: 10, resize: 'none', fontSize: 14 }}
      />

      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          size="small"
          type="dashed"
          onClick={() => setDesc(getDefaultText())}
          style={{
            width: '100%',
            marginTop: 8,
            borderRadius: 8,
            color: '#555',
            background: '#fafafa',
          }}
        >
          使用默认内容 ✨
        </Button>

        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ width: '100%', borderRadius: 10 }}
          loading={loading}
        >
          保存记录
        </Button>

        <Button
          type="link"
          onClick={() => setIsAdding(false)}
          style={{ width: '100%' }}
        >
          {isToday && latest ? '返回' : '取消'}
        </Button>
      </Space>
    </>
  );

  return (
    <div
      style={{
        width: '100%',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 📅 日期选择 + 有记录日期打点 */}
      <DatePicker
        value={selectedDate}
        onChange={(v) => v && setSelectedDate(v)}
        allowClear={false}
        style={{ width: '100%', marginBottom: 16, borderRadius: 8 }}
        disabledDate={(current) => current && current.isAfter(dayjs(), 'day')}
        dateRender={(current) => {
          const dateStr = current.format('YYYY-MM-DD');
          const hasRecord = recordDatesSet.has(dateStr);

          return (
            <div
              style={{
                position: 'relative',
                height: '100%',
                width: '100%',
                padding: 4,
                textAlign: 'center',
              }}
            >
              <div>{current.date()}</div>

              {hasRecord && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#52c41a',
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
            </div>
          );
        }}
      />

      {/* 如果一条记录都没有，可以给一个空提示（可选） */}
      {records.length === 0 && !isAdding && (
        <Empty description="还没有任何心情记录，先写一条试试吧～" />
      )}

      {/* 历史日期视图（非今天） */}
      {!isToday && (
        <>
          {/* 有记录且不在编辑模式：展示记录卡片 */}
          {!isAdding && latest && (
            <div
              style={{
                width: '100%',
                background: '#fafafa',
                borderRadius: 12,
                padding: 16,
                textAlign: 'center',
              }}
            >
              <Title level={5}>{selectedStr} 的心情</Title>
              <div style={{ fontSize: 48, marginBottom: 8 }}>
                {latest.moodScore > 0.5 ? '😁' : latest.moodScore < -0.5 ? '😢' : '🙂'}
              </div>
              <Text style={{ color: '#666' }}>{latest.description || '无备注'}</Text>
              <div style={{ marginTop: 12 }}>
                <Text type="secondary">
                  记录时间：{formatLocalTime(latest.createdAt, 'YYYY-MM-DD HH:mm:ss')}
                </Text>
              </div>
            </div>
          )}

          {/* 无记录且不在编辑模式：给一个“补充记录”入口 */}
          {!latest && !isAdding && (
            <div
              style={{
                width: '100%',
                background: '#fafafa',
                borderRadius: 12,
                padding: 16,
                textAlign: 'center',
              }}
            >
              <Title level={5}>{selectedStr} 暂无心情记录</Title>
              <div style={{ fontSize: 48, marginBottom: 8 }}>😐</div>
              <Text style={{ color: '#666' }}>你可以补充一次心情记录</Text>

              <Button
                type="primary"
                onClick={() => setIsAdding(true)}
                style={{ marginTop: 16, borderRadius: 8, width: '100%' }}
              >
                ➕ 补充心情记录
              </Button>
            </div>
          )}

          {/* 历史日期进入编辑模式 */}
          {isAdding && renderForm()}
        </>
      )}

      {/* 今日视图 */}
      {isToday && (
        <>
          {/* ✅ 当天已有记录时，先展示卡片 + “有新的心情？”按钮
              只有点击按钮才进入编辑模式（修复你说的 bug） */}
          {!isAdding && latest && (
            <div
              style={{
                width: '100%',
                background: '#fafafa',
                borderRadius: 12,
                padding: 16,
                textAlign: 'center',
              }}
            >
              <Title level={5}>{selectedStr} 的心情</Title>
              <div style={{ fontSize: 48, marginBottom: 8 }}>
                {latest.moodScore > 0.5 ? '😁' : latest.moodScore < -0.5 ? '😢' : '🙂'}
              </div>
              <Text style={{ color: '#666' }}>{latest.description || '无备注'}</Text>
              <div style={{ marginTop: 12 }}>
                <Text type="secondary">
                  上次记录时间：{formatLocalTime(latest.createdAt, 'HH:mm:ss')}
                </Text>
              </div>
              <Button
                type="dashed"
                onClick={() => setIsAdding(true)}
                style={{ marginTop: 16, borderRadius: 8 }}
              >
                🌟 有新的心情？
              </Button>
            </div>
          )}

          {/* 当天尚无记录 => 直接进入编辑模式
             或 已有记录但点击了“有新的心情？” => isAdding = true */}
          {(isAdding || !latest) && renderForm()}
        </>
      )}
    </div>
  );
};

export default MoodToday;
