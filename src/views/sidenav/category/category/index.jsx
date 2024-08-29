import { useState, useEffect, useContext } from "react";
import { Card, Table, Input, Button, Divider, Empty } from "antd";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { getTranslation } from "../../../../lang/translationUtils";
import {
  delete_category,
  get_category,
} from "../../../../store/slices/CategorySlice";
import { MessageBoxContext } from "../../../../context/MessageBoxContext";

import { useDispatch } from "react-redux";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EditCategory from "./edit_category";
import AddCategory from "./add_category";
const CategoryPage = () => {
  const { mb } = useContext(MessageBoxContext);
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [value, setValue] = useState("");
  useEffect(() => {
    const fetchCategories = () => {
      dispatch(get_category()).then((response) => {
        if (response.payload) {
          setCategories(response.payload);
        } else {
          console.error("Failed to load categories ");
        }
      });
    };
    fetchCategories();
  }, []);
  const handleEditing = (row) => {
    setIsEditing(true);
    setSelectedItem(row);
  };
  const onValueChange = (e) => {
    setValue(e.target.value.toLowerCase());
    if (value.length === 0) {
      setCategories(categories);
    }
    const searchCategory = categories.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setCategories(searchCategory);
  };
  const handleRemove = () => {
    const selectedIds = selectedRows.map((item) => item.id);
    dispatch(delete_category(selectedIds)).then((response) => {
      if (!response.error) {
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => !selectedIds.includes(cat.id))
        );
        setSelectedRows([]);
        setSelectedRowKeys([]);
      }
    });
  };
  const handleSingleRemove = (row) => {
    const id = [row.id];
    dispatch(delete_category(id)).then((response) => {
      if (!response.error) {
        setCategories((prevCategories) =>
          prevCategories.filter((item) => item.id !== id[0])
        );
        setSelectedRowKeys((prev) => prev.filter((key) => key !== id));

        close();
      } else {
        console.error("Error deleting category:", response.error);
      }
    });
  };
  const deleteMulitpleModal = () => {
    mb({
      //! Change Translations
      okText: getTranslation("sidenav.settings.unit.deleteButton"),
      title: getTranslation("sidenav.products.category.deleteTitle"),
      cancelText: getTranslation("sidenav.products.category.Cancel"),
      text: (
        <>
          {getTranslation("sidenav.settings.unit.deleteText")}
          {" - "}
          <strong style={{ color: "#FF6B72" }}>{` ${
            selectedRows.length
          }  ${getTranslation("sidenav.service.category")} `}</strong>
        </>
      ),
      okFunction: () => handleRemove(),
    });
  };
  const openModal = (row) => {
    mb({
      //! Change Translations
      okText: getTranslation("sidenav.settings.unit.deleteButton"),
      title: getTranslation("sidenav.products.category.deleteTitle"),
      cancelText: getTranslation("sidenav.products.category.Cancel"),
      text: (
        <>
          {getTranslation("sidenav.settings.unit.deleteText")}
          {" - "}
          <strong style={{ color: "#FF6B72" }}>{row.name}</strong>
        </>
      ),
      okFunction: () => handleSingleRemove(row),
    });
  };

  const dropdownMenu = (row) => [
    {
      key: "1",
      label: getTranslation("sidenav.settings.unit.Edit"),
      onClick: () => handleEditing(row),
      icon: <EditOutlined />,
    },
    {
      key: "2",
      label: getTranslation("sidenav.settings.unit.Delete"),
      onClick: () => openModal(row),
      icon: <DeleteOutlined />,
    },
  ];

  const columns = [
    {
      title: getTranslation("sidenav.products.category.table_category_name"),
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      align: "center",
      key: "name",
    },
    {
      title: getTranslation("sidenav.products.category.table_description"),
      dataIndex: "description",
      key: "description",
      render: (description) => (description ? description : "-"),
      align: "center",
    },
    {
      title: getTranslation(
        "sidenav.products.category.table_category_quantity"
      ),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },

    {
      title: "",
      width: 5,
      dataIndex: "actions",
      key: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };
  return (
    <Card>
      <div className="flex flex-row items-center  justify-between">
        <Input
          className="max-w-[180px]"
          placeholder={getTranslation("sidenav.products.category_search")}
          prefix={<SearchOutlined />}
          onChange={onValueChange}
          value={value}
        />

        {selectedRowKeys.length > 0 ? (
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            style={{
              backgroundColor: "red",
              borderColor: "red",
              padding: "4px 8px",
              fontSize: "15px",
            }}
            onClick={deleteMulitpleModal}
          >
            delete {selectedRows.length} Unit
          </Button>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            {getTranslation("sidenav.products.category.Add")}
          </Button>
        )}
      </div>
      {isAdding && (
        <AddCategory
          onSubmit={(Cat) => setCategories((prev) => [Cat, ...prev])}
          close={() => setIsAdding(false)}
        />
      )}

      {isEditing && (
        <EditCategory
          selectedItem={selectedItem}
          close={() => setIsEditing(false)}
          onSubmit={(updatedCategory) => {
            setCategories((prev) =>
              prev.map((item) =>
                item.id === updatedCategory.id ? updatedCategory : item
              )
            );
          }}
        />
      )}

      <div className="table-responsive">
        <Divider />
        <Table
          rowKey="id"
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
          pagination={false}
          columns={columns}
          dataSource={categories}
        />
      </div>
    </Card>
  );
};

export default CategoryPage;
