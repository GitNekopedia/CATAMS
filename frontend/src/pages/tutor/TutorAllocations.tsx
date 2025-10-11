import React, { useEffect, useMemo, useState } from "react";
import { Card, Select, Tabs, Typography, message, Table } from "antd";
import { useIntl } from "@umijs/max";
import { getTutorAllocations, getTutorCourses } from "@/services/task";
import AllocationsTable from "@/components/common/AllocationsTable";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const weeks = Array.from({ length: 12 }, (_, i) => `Week${i + 1}`);

const TutorAllocations: React.FC = () => {
  const intl = useIntl();
  const [courses, setCourses] = useState<API.TutorCourse[]>([]);
  const [allocations, setAllocations] = useState<Record<number, any[]>>({});
  const [rawAllocations, setRawAllocations] = useState<API.AllocationResponse[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | "ALL" | null>(null);
  const [activeTab, setActiveTab] = useState<string>("1");

  /** 获取课程列表 */
  useEffect(() => {
    getTutorCourses().then((res) => {
      if (res.success) {
        setCourses(res.data || []);
      } else {
        message.error(res.message || intl.formatMessage({ id: "unitAlloc.message.loadUnitFail" }));
      }
    });
  }, []);

  /** 根据选中课程加载 allocations */
  useEffect(() => {
    if (activeTab === "1" && selectedUnit) {
      const promises =
        selectedUnit === "ALL"
          ? courses.map((c) => getTutorAllocations(c.unitId))
          : [getTutorAllocations(selectedUnit)];

      Promise.all(promises).then((responses) => {
        const allData: API.AllocationResponse[] = [];
        responses.forEach((r) => {
          if (r.success) allData.push(...(r.data || []));
        });

        setRawAllocations(allData);

        /** 转换为每个unitId对应的Week1~Week12结构 */
        const grouped: Record<number, any[]> = {};
        if (allData.length > 0) {
          const allDates = allData.map((a) => new Date(a.weekStart).getTime());
          const min = Math.min(...allDates);

          allData.forEach((a) => {
            const diffWeeks = Math.floor((new Date(a.weekStart).getTime() - min) / (7 * 24 * 3600 * 1000));
            const weekKey = `Week${diffWeeks + 1}`;
            const unitId = a.unitId;

            if (!grouped[unitId]) grouped[unitId] = [];
            let row = grouped[unitId].find((r) => r.taskId === a.taskId);
            if (!row) {
              row = {
                id: a.taskId,
                taskId: a.taskId,
                taskName: a.taskName,
                typeName: a.typeName,
                weekHours: Object.fromEntries(weeks.map((w) => [w, 0])),
              };
              grouped[unitId].push(row);
            }
            row.weekHours[weekKey] = a.plannedHours;
          });
        }
        setAllocations(grouped);
      });
    }
  }, [activeTab, selectedUnit, courses]);

  /** 分周分组（日期 -> Week1..WeekN） */
  const byWeek = useMemo(() => {
    if (rawAllocations.length === 0) return {};

    const allDates = rawAllocations.map((a) => new Date(a.weekStart).getTime());
    const min = Math.min(...allDates);

    const grouped: Record<string, API.AllocationResponse[]> = {};
    rawAllocations.forEach((a) => {
      const diffWeeks = Math.floor((new Date(a.weekStart).getTime() - min) / (7 * 24 * 3600 * 1000));
      const weekKey = `Week${diffWeeks + 1}`;
      if (!grouped[weekKey]) grouped[weekKey] = [];
      grouped[weekKey].push(a);
    });
    return grouped;
  }, [rawAllocations]);

  /** 按周表格列定义 */
  const weekColumns: ColumnsType<API.AllocationResponse> = [
    { title: intl.formatMessage({ id: "approvals.col.unit" }), dataIndex: "unitName" },
    { title: intl.formatMessage({ id: "unitAlloc.unitTasks" }), dataIndex: "taskName" },
    { title: intl.formatMessage({ id: "unitAlloc.taskTypes" }), dataIndex: "typeName" },
    { title: intl.formatMessage({ id: "activity.tutor.plannedHours" }), dataIndex: "plannedHours" },
  ];

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* ✅ 按课程查看 */}
        <TabPane tab={intl.formatMessage({ id: "tutor.unitAlloc.allocations.by.course" })} key="1">
          <Card title={intl.formatMessage({ id: "unitAlloc.selectUnit" })} style={{ marginBottom: 24 }}>
            <Select
              style={{ width: 400 }}
              placeholder={intl.formatMessage({ id: "unitAlloc.chooseUnit" })}
              onChange={(v) => setSelectedUnit(v)}
              value={selectedUnit ?? undefined}
            >
              <Option key="ALL" value="ALL">
                {intl.formatMessage({ id: "unitAlloc.allUnits", defaultMessage: "All Courses" })}
              </Option>
              {courses.map((c) => (
                <Option key={c.unitId} value={c.unitId}>
                  {c.code} - {c.name}
                </Option>
              ))}
            </Select>
          </Card>

          {selectedUnit && (
            <>
              {selectedUnit === "ALL"
                ? Object.keys(allocations).map((unitId) => (
                  <Card
                    key={unitId}
                    title={
                      <Text strong>
                        {courses.find((c) => c.unitId === Number(unitId))?.code} -{" "}
                        {courses.find((c) => c.unitId === Number(unitId))?.name}
                      </Text>
                    }
                    style={{ marginBottom: 24 }}
                  >
                    <AllocationsTable editable={false} data={allocations[Number(unitId)] || []} />
                  </Card>
                ))
                : (
                  <Card
                    title={
                      <Text strong>
                        {courses.find((c) => c.unitId === selectedUnit)?.code} -{" "}
                        {courses.find((c) => c.unitId === selectedUnit)?.name}
                      </Text>
                    }
                  >
                    <AllocationsTable editable={false} data={allocations[selectedUnit] || []} />
                  </Card>
                )}
            </>
          )}
        </TabPane>

        {/* ✅ 按周查看（使用 Ant Design Table） */}
        <TabPane tab={intl.formatMessage({ id: "tutor.unitAlloc.allocations.by.week" })} key="2">
          {Object.keys(byWeek).map((weekKey) => (
            <Card
              key={weekKey}
              title={<Text strong> {weekKey}</Text>}
              style={{ marginBottom: 24 }}
            >
              <Table
                columns={weekColumns}
                dataSource={byWeek[weekKey]}
                rowKey="id"
                pagination={false}
                bordered
              />
            </Card>
          ))}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TutorAllocations;
