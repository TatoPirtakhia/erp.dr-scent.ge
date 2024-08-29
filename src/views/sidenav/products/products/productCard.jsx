import React from "react";
import { Card, Descriptions, Dropdown, Image } from "antd";
import { getTranslation } from "../../../../lang/translationUtils";
import {
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { API_BASE_URL } from "../../../../constants/ApiConstant";

const CardDropdown = ({ items }) => {
  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <a
        href="/#"
        className="text-gray font-size-lg"
        onClick={(e) => e.preventDefault()}
      >
        <EllipsisOutlined style={{ fontSize: 28, color: "white" }} />
      </a>
    </Dropdown>
  );
};

const ProductCard = ({ product, onEdit, onDelete }) => {
  const editOrDelete = [
    {
      key: "1",
      label: getTranslation("sidenav.client.Edit"),
      onClick: () => onEdit(product),
      icon: <EditOutlined />,
    },
    {
      key: "2",
      label: getTranslation("sidenav.client.Delete"),
      onClick: () => onDelete(product),
      icon: <DeleteOutlined />,
    },
  ];

  return (
    <Card
      cover={
        <div className="text-center">
          <Image
            width={170}
            src={`${API_BASE_URL}images/products/${product.image}`}
          />
        </div>
      }
      extra={<CardDropdown items={editOrDelete} />}
    >
      <Meta title={product.name} description={product.description} />
      <Descriptions
        bordered
        size="small"
        column={1}
        style={{ marginTop: "16px" }}
      >
        <Descriptions.Item label={getTranslation("sidenav.product.quantity")}>
          {product.quantity ? parseFloat(product.quantity) : 0}
        </Descriptions.Item>
        <Descriptions.Item label={getTranslation("sidenav.products.category")}>
          {product.category_name}
        </Descriptions.Item>
        {product.price ? (
          <Descriptions.Item label={getTranslation("sidenav.import.price")}>
            {" "}
            {product.price}
          </Descriptions.Item>
        ) : null}
        {product.total_price ? (
          <Descriptions.Item
            label={getTranslation("sidenav.import.total_price")}
          >
            {" "}
            {product.total_price}
          </Descriptions.Item>
        ) : null}
      </Descriptions>
    </Card>
  );
};

export default ProductCard;
