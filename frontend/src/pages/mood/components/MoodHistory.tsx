import React, { useState, useMemo } from 'react';
import { List, Pagination, Card, Typography, Tag, DatePicker, Space, Empty } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import Mood = API.Mood;
import {formatLocalTime} from "@/pages/mood/components/moodUtils";

const { Text } = Typography;

interface Props {
  records: Mood[];
  loading: boolean;
}

/**
 * ✅ 历史页增强版
 * - 按月份筛选
 * - 日期 + 时间双层排序
 * - 长描述支持左右滑动
 * - 统一视觉高度
 */
const MoodHistory: React.FC<Props> = ({ records, loading }) => {
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs()); // ✅ 默认当前月
  const pageSize = 7;

  /** ✅ 过滤 + 排序逻辑 */
  const filteredRecords = useMemo(() => {
    if (!records?.length) return [];
    const filtered = selectedMonth
      ? records.filter((r) => dayjs(r.recordDate).isSame(selectedMonth, 'month'))
      : records;

    return filtered.sort((a, b) => {
      const dateDiff = dayjs(b.recordDate).diff(dayjs(a.recordDate));
      if (dateDiff !== 0) return dateDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [records, selectedMonth]);

  const pagedRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  const getMoodTag = (score: number) => {
    if (score > 0.3) return <Tag color="green">{score.toFixed(2)} 😊 开心</Tag>;
    if (score < -0.3) return <Tag color="red">{score.toFixed(2)} 😢 低落</Tag>;
    return <Tag color="blue">{score.toFixed(2)} 😐 平静</Tag>;
  };

  /** ✅ 月份筛选变更 */
  const handleMonthChange = (value: Dayjs | null) => {
    setSelectedMonth(value);
    setPage(1); // 切换月份时回到第一页
  };

  return (
    <Card
      size="small"
      loading={loading}
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 📅 月份选择器 */}
        {/* 📅 月份选择器（居中显示） */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',  // ✅ 居中对齐
            marginBottom: 8,
          }}
        >
          <DatePicker
            picker="month"
            allowClear
            placeholder="筛选月份"
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{
              borderRadius: 8,
              width: 180,               // ✅ 适中宽度（避免太长）
              textAlign: 'center',
            }}
          />
        </div>


        {/* 📜 历史记录列表 */}
        {filteredRecords.length > 0 ? (
          <>
            <List
              dataSource={pagedRecords}
              bordered
              locale={{ emptyText: '暂无记录' }}
              renderItem={(item) => (
                <List.Item
                  style={{
                    minHeight: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text strong>{dayjs(item.recordDate).format('YYYY-MM-DD')}</Text>
                      <Text type="secondary">
                        {formatLocalTime(item.createdAt, 'HH:mm:ss')}
                      </Text>
                      {getMoodTag(item.moodScore)}
                      {/* 如果 recordDate 和 createdAt 的日期不同，显示“补”字样 */}
                      {dayjs(item.recordDate).format('YYYY-MM-DD') !== dayjs(item.createdAt).utc().format('YYYY-MM-DD') && (
                        <Tag color={"warning"}>补</Tag>
                      )}
                    </div>



                    {/* ✅ 长描述区域可横向拖动 */}
                    <div
                      style={{
                        marginTop: 4,
                        color: '#666',
                        fontSize: 13,
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        scrollbarWidth: 'thin',
                      }}
                    >
                      {item.description || '（无描述）'}
                    </div>
                  </div>
                </List.Item>
              )}
            />

            <Pagination
              current={page}
              total={filteredRecords.length}
              pageSize={pageSize}
              onChange={(p) => setPage(p)}
              style={{ marginTop: 12, textAlign: 'center' }}
              size="small"
            />
          </>
        ) : (
          <Empty
            description="暂无心情记录"
            imageStyle={{ height: 100 }}
            style={{ marginTop: 40 }}
          />
        )}
      </Space>
    </Card>
  );
};

export default MoodHistory;
