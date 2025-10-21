import React from "react";
import { Table, InputNumber, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";
import { useIntl } from "@umijs/max";

export type WeekHours = Record<string, number>;
export interface AllocationRow {
  id: number;
  taskId: number;
  typeName: string;
  taskName: string;
  payCategory?: string;   // 👈 新增：PHD / Non-PhD
  payRate?: number;       // 👈 新增：对应的时薪
  weekHours: WeekHours;
}

interface Props {
  editable?: boolean;
  data: AllocationRow[];
  onChange?: (id: number, week: string, value: number) => void;
  onDelete?: (row: AllocationRow) => void;
}

const AllocationsTable: React.FC<Props> = ({ editable = false, data, onChange, onDelete }) => {
  const intl = useIntl();
  const weeks = Array.from({ length: 12 }, (_, i) => `Week${i + 1}`);

  const columns: ColumnsType<AllocationRow> = [
    {
      title: intl.formatMessage({ id: "unitAlloc.unitTasks", defaultMessage: "Task" }),
      dataIndex: "taskName",
      fixed: "left",
      width: 260,
      render: (_: any, row: AllocationRow) => `[${row.typeName}] ${row.taskName}`,
    },
    // 👇 新增 PayRate 列
    {
      title: intl.formatMessage({
        id: "unitAlloc.payRate",
        defaultMessage: "Pay Rate",
      }),
      dataIndex: "payRate",
      width: 120,
      align: "center",
      render: (_: any, row: AllocationRow) =>
        row.payRate
          ? `[${row.payCategory ?? "N/A"}] ${row.payRate}`
          : "-",
    },
    ...weeks.map((week) => ({
      title: week,
      dataIndex: ["weekHours", week],
      render: (_: any, row: AllocationRow) =>
        editable ? (
          <InputNumber
            min={0}
            max={99}
            size="small"
            value={row.weekHours?.[week] ?? 0}
            onChange={(val) => onChange?.(row.taskId, week, Number(val ?? 0))}
            style={{ width: 60 }}
          />
        ) : (
          <div style={{ width: 60, textAlign: "center" }}>
            {row.weekHours?.[week] ?? 0}
          </div>
        ),
    })),
  ];

  // ✅ 删除列（仅在 editable 模式下显示）
  if (editable) {
    columns.push({
      title: intl.formatMessage({ id: "approvals.col.action", defaultMessage: "Action" }),
      width: 100,
      fixed: "right",
      render: (_: any, record: AllocationRow) => (
        <Popconfirm
          title={intl.formatMessage({
            id: "unitAlloc.message.confirmDelete",
            defaultMessage: "Confirm delete this task?",
          })}
          onConfirm={() => onDelete?.(record)}
        >
          <Button icon={<DeleteOutlined />} danger size="small" />
        </Popconfirm>
      ),
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={false}
      scroll={{ x: 1500 }}
      size="middle"
      bordered
    />
  );
};

export default AllocationsTable;
