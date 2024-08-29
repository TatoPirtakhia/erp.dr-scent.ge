import React, { useContext, useState } from "react";
import { Card, Table, Input, Button, Empty, Grid } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  CopyOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import Flex from "../../../../components/shared-components/Flex";
import utils from "../../../../utils/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  delete_product,
  get_product,
  getFilteredProduct,
  getProductCategory,
} from "../../../../store/slices/ProductSlice";
import AddProduct from "./add_products";
import EditProduct from "./edit_products";
import { API_BASE_URL } from "../../../../constants/ApiConstant";
import { NoImage } from "../../../../assets/svg/icon";
import CustomHelmet from "../../../../utils/customHelmet";
import { MessageBoxContext } from "../../../../context/MessageBoxContext";
import { getTranslation } from "../../../../lang/translationUtils";
import { CountUp } from "use-count-up";
import ProductFilter from "../../../../utils/productFilter";
import { get_unit } from "../../../../store/slices/UnitSlice";
import ProductCard from "./productCard";
const { useBreakpoint } = Grid;

const truncateText = (text, length) => {
  if (!text) return "-";
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

const Product = () => {
  const locale = useSelector((state) => state.theme.locale);
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes("lg");
  const { mb } = useContext(MessageBoxContext);
  const [listFilteredProducts, setListFilteredProducts] = useState([]);
  const [showProduct, setShowProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [ProductData, setProductData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const [unitOptions, setUnitOptions] = useState([]);
  const [unit, setUnit] = useState([]);

  const [categoryOptions, setCategoryOptions] = useState([]);

  const [isCopy, setIsCopy] = useState(false);
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState({
    Product: "All",
    search: "",
    category_id: null,
    unit_id: null,
  });

  useEffect(() => {
    if (!filterData) return;
    dispatch(getFilteredProduct({ filterData })).then((response) => {
      if (!response.error) {
        setProductData(response.payload);
      }
    });
  }, [filterData]);

  useEffect(() => {
    dispatch(getProductCategory()).then((response) => {
      if (!response.error) {
        setCategoryOptions(
          response.payload.map((item) => ({
            value: item.id,
            data: item,
            label: `${item.name} (${item.count})`,
          }))
        );
      }
    });
    dispatch(get_unit()).then((response) => {
      if (!response.error) {
        setUnitOptions(
          response.payload.data.map((item) => ({
            label: locale === "ka" ? item.name_ka : item.name_en,
            value: item.id,
            data: item,
          }))
        );
        setUnit(response.payload.data);
      }
    });
  }, []);

  useEffect(() => {
    let l = utils.wildCardSearch(ProductData, filterData.search);
    if (filterData.Product !== "All") {
      l = utils.filterArray(l, "name", filterData.Product);
    }
    setListFilteredProducts(l);
  }, [filterData, ProductData]);

  const copyProduct = (row) => {
    setSelectedData(row);
    setShowEditProduct(true);
    setIsCopy(true);
  };
  const viewDetails = (row) => {
    setSelectedData(row);
    setShowEditProduct(true);
  };

  const viewDelete = (row) => {
    mb({
      okText: getTranslation("sidenav.product.deleteButton"),
      title: getTranslation("sidenav.product.deleteTitle"),
      cancelText: getTranslation("sidenav.product.Cancel"),
      text: (
        <>
          {getTranslation("sidenav.product.deleteText")}
          {" - "}
          <strong style={{ color: "#FF6B72" }}>{row.name}</strong>
        </>
      ),
      okFunction: () => deleteSingle(row),
    });
  };

  const dropdownMenu = (row) => [
    {
      key: "1",
      label: getTranslation("sidenav.product.Edit"),
      onClick: () => viewDetails(row),
      icon: <EditOutlined />,
    },
    {
      key: "2",
      label: getTranslation("sidenav.product.copy"),
      onClick: () => copyProduct(row),
      icon: <CopyOutlined />,
    },
    {
      key: "3",
      label: getTranslation("sidenav.product.Delete"),
      onClick: () => viewDelete(row),
      icon: <DeleteOutlined />,
    },
  ];

  const deleteRow = () => {
    const selectedIds = selectedRows.map((row) => row.id);
    dispatch(delete_product(selectedIds)).then((res) => {
      if (!res.error) {
        setProductData((prev) =>
          prev.filter((p) => !selectedIds.includes(p.id))
        );
        setSelectedRows([]);
      }
    });
  };

  const deleteSingle = (row) => {
    const selectedIds = [row.id];
    dispatch(delete_product(selectedIds)).then((res) => {
      if (!res.error) {
        setProductData((prev) => prev.filter((p) => selectedIds[0] !== p.id));
        setSelectedRows((prev) => prev.filter((id) => id !== selectedIds[0]));
      }
    });
  };
  const tableColumns = [
    {
      title: getTranslation("sidenav.product.table_Product_name"),
      align: "center",
      render: (_, record) => (
        <div className="flex items-center gap-3 min-w-[250px]">
          {!record.image ? (
            <NoImage height={35} width={40} />
          ) : (
            <img
              alt="Product Image"
              height={45}
              width={45}
              style={{ objectFit: "contain" }}
              src={`${API_BASE_URL}images/products/${record.image}`}
            />
          )}
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: getTranslation("sidenav.products.category"),
      align: "center",
      render: (_, record) => (
        <Flex justifyContent="center">
          <span>{record.category_name || "-"}</span>
        </Flex>
      ),
    },
    {
      title: getTranslation("sidenav.product.table_description"),
      align: "center",
      render: (_, record) => (
        <div className="text-center max-w-[300px]">
          <span>
            {isMobile
              ? truncateText(record.description, 20)
              : record.description || "-"}
          </span>
        </div>
      ),
    },

    {
      title: getTranslation("sidenav.product.units"),
      align: "center",
      render: (_, record) => (
        <Flex justifyContent="center">
          <span>
            {parseInt(record.unit_id) === -1
              ? getTranslation("sidenav.product.item")
              : `${locale === "ka" ? record.name_ka : record.name_en}`}
          </span>
        </Flex>
      ),
    },
    {
      title: getTranslation("sidenav.product.quantity"),
      align: "center",
      render: (_, record) => (
        <Flex justifyContent="center">
          <span>
            <CountUp
              isCounting
              duration={0.7}
              end={record.quantity ? parseInt(record.quantity) : 0}
              thousandsSeparator=","
            />
          </span>
        </Flex>
      ),
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

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };

  const onSearch = (e) => {
    setFilterData((prev) => ({ ...prev, search: e.target.value }));
  };
  return (
    <>
      <CustomHelmet title="sidenav.products" />
      <Card>
        <div className="flex flex-col  md:flex-row md:justify-between ">
          <div className="mr-md-3 mb-3 flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              className="min-w-[180px]"
              placeholder={getTranslation("sidenav.product.globalInputSearch")}
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
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
                delete {selectedRows.length} product
              </Button>
            )}
          </div>
        </div>
        {isMobile ? (
          <div className=" mt-4">
            {listFilteredProducts.length > 0 ? (
              listFilteredProducts.map((item) => (
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
                description={getTranslation("sidenav.client.empty")}
              />
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <Table
              columns={tableColumns}
              dataSource={listFilteredProducts}
              rowKey="id"
              locale={{
                emptyText: (
                  <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    description={getTranslation("sidenav.product.empty")}
                  />
                ),
              }}
              rowSelection={{
                selectedRowKeys: selectedRowKeys,
                type: "checkbox",
                preserveSelectedRowKeys: false,
                hideSelectAll: false,
                ...rowSelection,
              }}
            />
          </div>
        )}

        {!showProduct ? null : (
          <AddProduct
            visible={showProduct}
            close={() => setShowProduct(false)}
            onSubmit={(Product) => {
              setProductData((prev) => [Product, ...prev]);
            }}
          />
        )}

        {!showEditProduct ? null : (
          <EditProduct
            isCopy={isCopy}
            visible={showEditProduct}
            data={selectedData}
            close={() => {
              setIsCopy(false);
              setShowEditProduct(false);
            }}
            onSubmit={(Product) => {
              console.log(Product);
              if (isCopy) {
                setProductData((prev) => [Product, ...prev]);
                setIsCopy(false);
              } else {
                setProductData((prev) =>
                  prev.map((elm) => (elm.id === Product.id ? Product : elm))
                );
              }
            }}
          />
        )}
      </Card>
    </>
  );
};

export default Product;
