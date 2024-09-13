import React, { useState } from "react";
import { Card, Table, Input, Button, Empty, Flex } from "antd";
import { getTranslation } from "../../../../lang/translationUtils";

const ServiceSettings = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // Table components
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];
  const tableColumns = [
    {
      title: "Test2",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Test",
      dataIndex: "age",
      align: "center",
    },
  ];
  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };
  return (
    <div className="table-responsive">
      <Table
        rowKey="key"
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          type: "checkbox",
          preserveSelectedRowKeys: false,
          hideSelectAll: false,
          ...rowSelection,
        }}
        locale={{
          emptyText: (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              description={getTranslation("sidenav.products.category.empty")}
            />
          ),
        }}
        className="text-center"
        pagination={true}
        columns={tableColumns}
        dataSource={dataSource}
      />
    </div>
  );
};

export default ServiceSettings;
