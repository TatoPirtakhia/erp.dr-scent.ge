import React, { useState } from "react";
import { Button, Card, Carousel, Drawer, Dropdown } from "antd";
import {
  EditOutlined,
  AimOutlined,
  EllipsisOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { getTranslation } from "../../../../lang/translationUtils";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../../constants/ApiConstant";
import { NoImage } from "../../../../assets/svg/icon";
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

const AddressList = (props) => {
  const settings = useSelector((state) => state.systemInfo.settings);
  const { open, close, data, onEdit, onViewLocation, clientId } = props;
  const importExport = (item) => {
    return [
      {
        key: "1",
        label: getTranslation("sidenav.client.Edit"),
        onClick: () => onEdit(item),
        icon: <EditOutlined />,
      },
    ];
  };
  return (
    <>
      <Drawer
        title={data[0]?.brand_name}
        placement="right"
        size="large"
        onClose={close}
        open={open}
      >
        {data &&
          data.map((item, index) => (
            <Card
              key={index}
              title={item.city_name}
              className="client-card"
              style={{ marginBottom: 16 }}
              cover={
                item.images.length > 0 ?
                  <div className="mt-3  rounded-[12px]">
                    <Carousel
                      effect="scrollx"
                      dotPosition="bottom"
                      className="min-h-[170px]"
                      autoplay
                    >

                      {item.images.map((branch, index) => (
                        <div key={index}>
                          <img
                            alt={`slider-image-${index}`}
                            src={`${API_BASE_URL}images/clients/images/user_${clientId}/branch_${item.id}/${branch.image}`}
                            style={{
                              width: "100%",
                              height: "140px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div> : <NoImage height={170} width={370} />
              }
              extra={<CardDropdown items={importExport(item)} />}
            >
              <p className="mb-0 ">
                <strong>{getTranslation("sidenav.client.state")}: </strong>
                {item.state_name}
              </p>

              <p className="mb-0">
                <strong>
                  {getTranslation("sidenav.client.tableCreatedAt")}:{" "}
                </strong>
                {dayjs(item.create_date).format(settings?.date_format)}
              </p>
              <p>
                <strong>{getTranslation("sidenav.client.Address")}: </strong>
                {item.address}
              </p>

              <Button
                disabled={!item.latitude}
                className="mt-3"
                icon={<AimOutlined />}
                onClick={() => onViewLocation(item)}
              >
                {getTranslation("sidenav.admins.google_location")}
              </Button>
            </Card>
          ))}
      </Drawer>
    </>
  );
};
export default AddressList;
