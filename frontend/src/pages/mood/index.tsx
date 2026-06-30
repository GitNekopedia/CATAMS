import React, { useEffect, useState } from 'react';
import { Card, Tabs, message } from 'antd';
import { getMoodList, recordMood } from '@/services/mood/mood';
import MoodOverview from './components/MoodOverview';
import MoodToday from './components/MoodToday';
import MoodStats from './components/MoodStats';
import MoodHistory from './components/MoodHistory';
import { calcMonthlySummary } from './components/moodUtils';
import './moodPage.css';
import Mood = API.Mood;

/**
 * 心情主页容器组件
 * - 负责：数据获取、提交保存、把数据分发给各子组件
 * - 子组件：Today / Overview / Trend / History
 */
const MoodPage: React.FC = () => {
  /** 所有心情记录（一次性加载） */
  const [allRecords, setAllRecords] = useState<Mood[]>([]);

  /**
   * loading.today  : 提交心情记录时的按钮 loading
   * loading.history: 加载列表（初次 / 刷新）时的 loading
   */
  const [loading, setLoading] = useState({ today: false, history: false });

  /** 历史数据是否已经从后端完整加载过（用于懒加载 + 是否强制刷新） */
  const [historyLoaded, setHistoryLoaded] = useState(false);

  /** 用于通知趋势图组件刷新（简单的自增 key） */
  const [refreshTrend, setRefreshTrend] = useState(0);

  /** ✅ 加载历史记录（可根据 force 选择是否强制刷新） */
  const loadHistory = async (force = false) => {
    if (historyLoaded && !force) return;

    setLoading((l) => ({ ...l, history: true }));
    try {
      const data = await getMoodList();
      setAllRecords(data);
      setHistoryLoaded(true);
    } catch {
      message.error('加载历史记录失败');
    } finally {
      setLoading((l) => ({ ...l, history: false }));
    }
  };

  /** ✅ 提交一条心情记录 */
  const handleSubmit = async (payload: { score: number; desc: string; date: string }) => {
    setLoading((l) => ({ ...l, today: true }));
    try {
      await recordMood(payload);
      message.success('心情记录成功');

      // 构造一个本地临时记录（用于在未完全加载历史的情况下，先行乐观更新）
      const newRecord: Mood = {
        id: Date.now(), // 临时 id，仅前端显示使用
        userId: 0,
        moodScore: payload.score,
        description: payload.desc,
        recordDate: payload.date,
        createdAt: new Date().toISOString(),
      };

      if (historyLoaded) {
        // 历史列表已经加载过：直接从后端重新拉一遍，避免数据不一致
        await loadHistory(true);
      } else {
        // 历史列表还没加载：先把新记录追加到前端列表
        setAllRecords((prev) => [...prev, newRecord]);
      }

      // 通知趋势图刷新
      setRefreshTrend((v) => v + 1);
    } catch {
      message.error('记录失败，请稍后重试');
    } finally {
      setLoading((l) => ({ ...l, today: false }));
    }
  };

  /** 🌅 首次挂载：预加载历史记录（含今天在内所有记录） */
  useEffect(() => {
    loadHistory();
  }, []);

  /** 📊 概览：自动计算本月心情概况 */
  const summary = calcMonthlySummary(allRecords);

  /** 🕹️ Tab 懒加载触发器（目前只对“记录”页做懒加载保护） */
  const handleTabChange = async (key: string) => {
    if (key === 'history') await loadHistory();
  };

  return (
    <div className="mood-wrapper">
      <Card className="mood-card" variant="borderless">
        <div className="mood-header">
          <h3>心情小记</h3>
        </div>

        <Tabs
          className="mood-tabs"
          centered
          defaultActiveKey="today"
          animated
          onChange={handleTabChange}
          items={[
            {
              key: 'today',
              label: '今日',
              children: (
                <div className="mood-section">
                  {/* ✅ Today 组件只负责展示 & 交互，数据由父组件传入 */}
                  <MoodToday
                    records={allRecords}
                    onSubmit={handleSubmit}
                    loading={loading.today}
                  />
                </div>
              ),
            },
            {
              key: 'overview',
              label: '概览',
              children: (
                <div className="mood-section">
                  <MoodOverview summary={summary} />
                </div>
              ),
            },
            {
              key: 'trend',
              label: '趋势',
              children: (
                <div className="mood-section">
                  {/* ✅ 通过 refreshKey 强制统计图刷新 */}
                  <MoodStats refreshKey={refreshTrend} />
                </div>
              ),
            },
            {
              key: 'history',
              label: '记录',
              children: (
                <div className="mood-section">
                  <MoodHistory records={allRecords} loading={loading.history} />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default MoodPage;
