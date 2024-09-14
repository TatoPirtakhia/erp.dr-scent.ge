// საბა ჯიაძე 9/12
import React, { useState, useEffect, useContext } from "react";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Table, Empty, Card, Button, Input } from "antd";
import { getTranslation } from "../../../../lang/translationUtils";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import CustomHelmet from "../../../../utils/customHelmet";
import AddServiceSettings from "./add_service_settings";
import EditServiceSettings from "./edit_service_settings";
import { MessageBoxContext } from "../../../../context/MessageBoxContext";
import SquareBox from "./SquareBox";

const ServiceSettings = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [color, setColor] = useState("#FFFF");
  const [textColor, setTextColor] = useState("#0000");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState({});
  const { mb } = useContext(MessageBoxContext);
  useEffect(() => {}, []);

  const dropdownMenu = (row) => [
    {
      key: "1",
      label: getTranslation("sidenav.settings.unit.Edit"),
      onClick: () => handleEdit(row),
      icon: <EditOutlined />,
    },
    {
      key: "2",
      label: getTranslation("sidenav.settings.unit.Delete"),
      onClick: () => handleSingleDelete(row),
      icon: <DeleteOutlined />,
    },
  ];

  const handleSingleDelete = (row) => {
    mb({
      okText: getTranslation("sidenav.settings.unit.deleteButton"),
      title: `${getTranslation("sidenav.settings.unit.deleteTitle")}`,
      cancelText: getTranslation("sidenav.settings.unit.Cancel"),
      text: (
        <>
          {getTranslation("sidenav.settings.unit.deleteText")}
          {" - "}
          <strong style={{ color: "#FF6B72" }}>{row.name}</strong>
        </>
      ),
      okFunction: () => handleDeleteModal(row),
    });
  };
  const handleMultipleDelete = (row) => {
    mb({
      okText: getTranslation("sidenav.settings.unit.deleteButton"),
      title: getTranslation("sidenav.settings.unit.deleteTitle"),
      cancelText: getTranslation("sidenav.settings.unit.Cancel"),
      text: (
        <>
          {getTranslation("sidenav.settings.unit.deleteText")}
          {" - "}
          <strong style={{ color: "#FF6B72" }}>{row.name}</strong>
        </>
      ),
      okFunction: () => onMultipleDelete(),
    });
  };

  const dataSource = [
    {
      key: "1",
      title: "Settings",
      percent: 42,
      color: "White",
    },
    {
      key: "2",
      title: "Progress Bar",
      percent: 32,
      color: <SquareBox color={color} />,
    },
  ];
  const tableColumns = [
    {
      title: "რეინჯი",
      dataIndex: "color",
      align: "center",
      // Do it when it comes from database
      // render: (color) => <SquareBox color={color} />,
    },
    {
      title: "პროგრესის ბარი",
      dataIndex: "color",
      align: "center",
    },
    {
      title: "პარამეტრი",
      dataIndex: "percent",
      align: "center",
    },
    {
      title: "",
      dataIndex: "percent",
      align: "center",
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];
  // Functions
  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };
  const onClose = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsDeleting(false);
  };
  const onMultipleDelete = (row) => {
    const selectedIds = selectedRows.map((item) => item.key);
  };
  const handleEdit = (row) => {
    setSelectedItemData(row);
    setIsEditing(true);
  };
  const handleDeleteModal = (row) => {};
  return (
    <>
      <CustomHelmet title="sidenav.settings.Unit" />
      <Card>
        <div className="flex flex-col  md:flex-row md:justify-between ">
          <div className="mr-md-3 mb-3">
            <Input
              placeholder={getTranslation("globalInputSearch")}
              prefix={<SearchOutlined />}
            />
          </div>
          <div>
            {selectedRows.length === 0 ? (
              <Button
                onClick={() => setIsAdding(true)}
                type="primary"
                icon={<PlusCircleOutlined />}
                block
              >
                {getTranslation("sidenav.settings.unit.add_Unit")}
              </Button>
            ) : (
              <Button
                onClick={handleMultipleDelete}
                type="primary"
                icon={<DeleteOutlined />}
                style={{
                  backgroundColor: "red",
                  borderColor: "red",
                  padding: "4px 8px",
                  fontSize: "15px",
                }}
                block
              >
                delete {selectedRows.length} Unit
              </Button>
            )}
          </div>
        </div>
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
                  description={getTranslation(
                    "sidenav.products.category.empty"
                  )}
                />
              ),
            }}
            className="text-center"
            pagination={true}
            columns={tableColumns}
            dataSource={dataSource}
          />
        </div>
        {isAdding && (
          <AddServiceSettings
            onColorChange={(color) => setColor(color)}
            onClose={onClose}
            onTextColorChange={(color) => setTextColor(color)}
          />
        )}
        {isEditing && (
          <EditServiceSettings data={selectedItemData} onClose={onClose} />
        )}
      </Card>
    </>
  );
};
export default ServiceSettings;
