import React, { useState, useEffect } from "react";
import { Card, Input, Button, Table, Empty, Grid, Menu, Modal } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import { getTranslation } from "../../../../lang/translationUtils";
import { useDispatch, useSelector } from "react-redux";
import utils from "../../../../utils/index";
import { delete_product, getFilteredProduct, getProductCategory } from "../../../../store/slices/ProductSlice";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import { get_unit } from "../../../../store/slices/UnitSlice";
import ProductFilter from "../../../../utils/productFilter";
import AddProduct from "../../products/products/add_products.jsx";
import EditProduct from "../../products/products/edit_products.jsx";
import ProductCard from "../../products/products/productCard.jsx";

const { useBreakpoint } = Grid;
const { confirm } = Modal;

const DefaultDashboard = () => {
  const settings = useSelector((state) => state.systemInfo.settings);
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes("lg");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterData, setFilterData] = useState({
    Product: "All",
    search: "",
    category_id: null,
    unit_id: null,
  });
  const [data, setData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [showProduct, setShowProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFilteredProduct(filterData)).then((response) => {
      if (!response.error) {
        setData(response.payload.data || []);
      } else {
        console.error("Error fetching products:", response.error);
      }
    }).catch((error) => {
      console.error("Error fetching products:", error);
    });
  }, [dispatch, filterData]);

  useEffect(() => {
    dispatch(getProductCategory()).then((response) => {
      if (!response.error) {
        const categories = (response.payload.data || []).map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setCategoryOptions(categories);
      } else {
        console.error('Error fetching product categories:', response.error);
      }
    }).catch((error) => {
      console.error('Error fetching product categories:', error);
    });

    dispatch(get_unit()).then((response) => {
      if (!response.error) {
        const units = (response.payload.data || []).map((item) => ({
          label: item.name_en,
          value: item.id,
        }));
        setUnitOptions(units);
      } else {
        console.error('Error fetching unit options:', response.error);
      }
    }).catch((error) => {
      console.error('Error fetching unit options:', error);
    });
  }, [dispatch]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
      setSelectedRows(selectedRows);
    },
    type: "checkbox",
  };

  const viewDetails = (row) => {
    setSelectedData(row);
    setShowEditProduct(true);
  };

  const viewDelete = (row) => {
    confirm({
      title: getTranslation("sidenav.product.deleteTitle"),
      content: (
        <>
          {getTranslation("sidenav.product.deleteText")} -{" "}
          <strong style={{ color: "#FF6B72" }}>{row.name}</strong>
        </>
      ),
      okText: getTranslation("sidenav.product.deleteButton"),
      cancelText: getTranslation("sidenav.product.Cancel"),
      onOk: () => deleteSingle(row),
    });
  };

  const deleteRow = () => {
    const selectedIds = selectedRows.map((row) => row.id);
    dispatch(delete_product(selectedIds)).then((res) => {
      if (!res.error) {
        setData((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
        setSelectedRows([]);
      } else {
        console.error("Error deleting products:", res.error);
      }
    }).catch((error) => {
      console.error("Error deleting products:", error);
    });
  };

  const deleteSingle = (row) => {
    const selectedIds = [row.id];
    dispatch(delete_product(selectedIds)).then((res) => {
      if (!res.error) {
        setData((prev) => prev.filter((p) => selectedIds[0] !== p.id));
        setSelectedRows((prev) => prev.filter((id) => id !== selectedIds[0]));
      } else {
        console.error("Error deleting product:", res.error);
      }
    }).catch((error) => {
      console.error("Error deleting product:", error);
    });
  };

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item key="1" icon={<EditOutlined />} onClick={() => viewDetails(row)}>
        {getTranslation("sidenav.settings.unit.Edit")}
      </Menu.Item>
      <Menu.Item key="2" icon={<DeleteOutlined />} onClick={() => viewDelete(row)}>
        {getTranslation("sidenav.settings.unit.Delete")}
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: getTranslation("sidenav.product.table_Product_name"),
      dataIndex: "productName",
      key: "productName",
      align: "center",
    },
    {
      title: getTranslation("sidenav.products.category"),
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: getTranslation("sidenav.product.table_description"),
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: getTranslation("sidenav.product.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "",
      width: 5,
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  const onSearch = (e) => {
    setFilterData((prev) => ({ ...prev, search: e.target.value }));
  };

  return (
    <>
      <Card className="ant-card-bordered">
        <Flex className="flex flex-col md:flex-row md:justify-between">
          <div className="mr-md-3 flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              className="min-w-[180px]"
              placeholder={getTranslation("sidenav.product.globalInputSearch")}
              prefix={<SearchOutlined />}
              onChange={onSearch}
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="w-full md:w-[80px]">
              <ProductFilter
                setFilterData={setFilterData}
                categoryOptions={categoryOptions}
                filterData={filterData}
                unitOptions={unitOptions}
              />
            </div>
            {selectedRows.length === 0 ? (
              <Button
                onClick={() => setShowProduct(true)}
                type="primary"
                icon={<PlusCircleOutlined />}
                block
              >
                {getTranslation("sidenav.product.add_product")}
              </Button>
            ) : (
              <Button
                onClick={deleteRow}
                type="danger"
                icon={<DeleteOutlined />}
                block
              >
                Delete {selectedRows.length} product
                {selectedRows.length > 1 ? "s" : ""}
              </Button>
            )}
          </div>
        </Flex>

        {/* Mobile View */}
        {isMobile && (
          <div className="mt-4">
            {data.length > 0 ? (
              data.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onEdit={viewDetails}
                  onDelete={viewDelete}
                />
              ))
            ) : (
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                description={getTranslation("sidenav.product.empty")}
              />
            )}
          </div>
        )}

        {/* Desktop View */}
        {!isMobile && (
          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={data}
              rowSelection={rowSelection}
              rowKey="id"
              locale={{
                emptyText: (
                  <Empty description={getTranslation("sidenav.product.empty")} />
                ),
              }}
            />
          </div>
        )}
      </Card>
      <AddProduct
        showProduct={showProduct}
        setShowProduct={setShowProduct}
        refreshData={() => dispatch(getFilteredProduct(filterData))}
      />
      {selectedData && (
        <EditProduct
          showEditProduct={showEditProduct}
          setShowEditProduct={setShowEditProduct}
          selectedData={selectedData}
          refreshData={() => dispatch(getFilteredProduct(filterData))}
        />
      )}
    </>
  );
};

export default DefaultDashboard;
