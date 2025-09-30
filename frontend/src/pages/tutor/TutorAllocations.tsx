import React, { useEffect, useMemo, useState } from "react";
import { Card, Select, Table, Tabs, Typography, message } from "antd";
import { getTutorAllocations, getTutorCourses } from "@/services/task";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const TutorAllocations: React.FC = () => {
  const [courses, setCourses] = useState<API.TutorCourse[]>([]);
  const [allocations, setAllocations] = useState<API.AllocationResponse[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("1");

  // Tutor 拥有的课程
  useEffect(() => {
    getTutorCourses().then((res) => {
      if (res.success) {
        setCourses(res.data || []);
      } else {
        message.error(res.message || "加载课程失败");
      }
    });
  }, []);

  // 按课程加载
  useEffect(() => {
    if (activeTab === "1" && selectedUnit) {
      getTutorAllocations(selectedUnit).then((res) => {
        if (res.success) {
          setAllocations(res.data || []);
        } else {
          message.error(res.message || "加载分配失败");
        }
      });
    }
  }, [activeTab, selectedUnit]);

  // 按周加载
  useEffect(() => {
    if (activeTab === "2") {
      getTutorAllocations().then((res) => {
        if (res.success) {
          setAllocations(res.data || []);
        } else {
          message.error(res.message || "加载分配失败");
        }
      });
    }
  }, [activeTab]);

  // === 表格列 ===
  const unitColumns: ColumnsType<API.AllocationResponse> = [
    { title: "Task", dataIndex: "taskName" },
    { title: "Type", dataIndex: "typeName" },
    { title: "Week Start", dataIndex: "weekStart" },
    { title: "Planned Hours", dataIndex: "plannedHours" },
  ];

  const weekColumns: ColumnsType<API.AllocationResponse> = [
    { title: "Course", dataIndex: "unitName" },
    { title: "Task", dataIndex: "taskName" },
    { title: "Type", dataIndex: "typeName" },
    { title: "Planned Hours", dataIndex: "plannedHours" },
  ];

  // 按周分组
  const byWeek = useMemo(() => {
    const grouped: Record<string, API.AllocationResponse[]> = {};
    allocations.forEach((a) => {
      if (!grouped[a.weekStart]) grouped[a.weekStart] = [];
      grouped[a.weekStart].push(a);
    });
    return grouped;
  }, [allocations]);

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 按课程 */}
        <TabPane tab="View by Course" key="1">
          <Card title="Select Unit" style={{ marginBottom: 24 }}>
            <Select
              style={{ width: 400 }}
              placeholder="Choose a Unit"
              onChange={(v) => setSelectedUnit(v)}
              value={selectedUnit ?? undefined}
            >
              {courses.map((c) => (
                <Option key={c.unitId} value={c.unitId}>
                  {c.code} - {c.name}
                </Option>
              ))}
            </Select>
          </Card>

          {selectedUnit && (
            <Card
              title={
                <Text strong>
                  {courses.find((c) => c.unitId === selectedUnit)?.code} -{" "}
                  {courses.find((c) => c.unitId === selectedUnit)?.name}
                </Text>
              }
            >
              <Table
                columns={unitColumns}
                dataSource={allocations}
                rowKey="id"
                pagination={false}
              />
            </Card>
          )}
        </TabPane>

        {/* 按周 */}
        <TabPane tab="View by Week" key="2">
          {Object.keys(byWeek).map((weekStart) => (
            <Card key={weekStart} title={<Text strong>Week of {weekStart}</Text>} style={{ marginBottom: 24 }}>
              <Table
                columns={weekColumns}
                dataSource={byWeek[weekStart]}
                rowKey="id"
                pagination={false}
              />
            </Card>
          ))}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TutorAllocations;
