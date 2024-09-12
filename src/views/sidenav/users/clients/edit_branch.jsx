import {
  Modal,
  Form,
  Input,
  Button,
  App,
  Row,
  Col,
  Select,
  Tooltip,
  InputNumber,
  Empty,
  Tabs,
} from "antd";
import { useState, useEffect } from "react";
import Flex from "../../../../components/shared-components/Flex";
import { useDispatch } from "react-redux";
import {
  editBranch,
  getAdminsForClient,
} from "../../../../store/slices/UsersSlice";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import {
  getCountries,
  getRegions,
} from "../../../../store/slices/CountrySlice";
import { UserOutlined, AimOutlined } from "@ant-design/icons";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import { getTranslation } from "../../../../lang/translationUtils";
import { API_BASE_URL } from "../../../../constants/ApiConstant";
import resizeImage from "../../../../utils/resizeImage";
import { getCompanyType } from "../../../../store/slices/companyTypeSlice";
import TextArea from "antd/es/input/TextArea";
import MapBox from "../../../../Maps";
import { getCities } from "../../../../store/slices/CitiesSlice";
import AddOrUpdateLayout from "../../../../components/shared-components/add_or_edit_layout";
import EditBranchImage from "./editBranchImage";
const EditBranch = (props) => {
  const { notification } = App.useApp();
  const {
    visible,
    close,
    onSubmit,
    data,
    latitude,
    longitude,
    onImageEdit,
    onImageDelete,
  } = props;
  const [LocationVisible, setLocationVisible] = useState(false);
  const [location, setLocation] = useState({
    latitude: data.latitude,
    longitude: data.longitude,
  });

  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  const [states, setStates] = useState([]);
  const [stateId, setStateId] = useState(parseInt(data.state_id));

  const [country, setCountry] = useState([]);
  const [countryId, setCountryId] = useState(parseInt(data.country_id));

  const [citiesOptions, setCitiesOptions] = useState([]);

  const [clients, setClients] = useState([]);
  const [companyTypeOptions, setCompanyTypeOptions] = useState([]);
  const [selectedAdminsId, setSelectedAdminsId] = useState(() => {
    const admins = data.admins || [];
    return admins.length > 0
      ? admins.filter((elm) => elm.id !== null).map((elm) => elm.id)
      : [];
  });
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCompanyType()).then((res) => {
      if (!res.error) {
        setCompanyTypeOptions(
          res.payload.map((elm) => ({
            data: elm,
            label: elm.name,
            value: elm.id,
          }))
        );
      }
    });
  }, []);

  useEffect(() => {
    dispatch(getCountries()).then((response) => {
      if (!response.error) {
        setCountry(response.payload.countries);
      }
    });
  }, []);

  useEffect(() => {
    dispatch(
      getCities({
        country_id: null,
        state_id: null,
      })
    ).then((response) => {
      if (!response.error) {
        setCitiesOptions(
          response.payload.data.map((elm) => ({
            value: elm.id,
            data: elm,
            label: (
              <Flex gap={5} alignItems="center">
                {`${elm.name}`}
              </Flex>
            ),
          }))
        );
      }
    });
  }, []);
  useEffect(() => {
    dispatch(getRegions(null)).then((response) => {
      if (!response.error) {
        setStates(response.payload.states);
      }
    });
  }, []);

  useEffect(() => {
    dispatch(getAdminsForClient()).then((response) => {
      if (!response.error) {
        const selectedAdmins = response.payload
          .filter((elm) => selectedAdminsId.includes(elm.id)) // Filter only selected IDs
          .map((elm) => ({
            label: (
              <div className="p-1">
                <AvatarStatus
                  id={elm.id}
                  first_name={elm.first_name}
                  subTitle={elm.email}
                  icon={<UserOutlined />}
                  size="small"
                />
              </div>
            ),
            value: elm.id,
          }));
        form.setFieldValue("admins", selectedAdmins);

        setClients(
          response.payload.map((elm) => ({
            label: (
              <div className="p-1">
                <AvatarStatus
                  id={elm.id}
                  first_name={elm.first_name}
                  subTitle={elm.email}
                  icon={<UserOutlined />}
                  size="small"
                />
              </div>
            ),
            value: elm.id,
            data: elm,
          }))
        );
      }
    });
  }, []);

  const handleSave = async () => {
    if (isLoading) return;
    try {
      // setIsLoading(true)
      const values = await form.validateFields();
      const body = {
        id: data.id,
        ...values,
        state_id: stateId,
        country_id: countryId,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      dispatch(editBranch(body)).then(async (response) => {
        if (!response.error) {
          let document_images = [];
          notification.success({
            message: getTranslation("sidenav.client.Done"),
            description: getTranslation(response.payload.message),
          });
          onSubmit(body);
          close();
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: clients,
    maxTagCount: "responsive",
    filterOption: (input, option) => {
      return (
        option?.data?.first_name?.toLowerCase().includes(input.toLowerCase()) ||
        option?.data?.email?.toLowerCase().includes(input.toLowerCase())
      );
    },
  };
  const selectProps = {
    value: selectedAdminsId,
    onChange: setSelectedAdminsId,
  };
  const items = [
    {
      key: "1",
      label: getTranslation("sidenav.admins.branches_tab_info"),
      children: (
        <Form
          name="basicInformation"
          layout="vertical"
          onFinish={handleSave}
          form={form}
          initialValues={{
            company_type_id: parseInt(data.company_type_id),
            address: data.address,
            state_id: data.state_id,
            city_id: data.city_id,
            note: data.note,
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={25}>
              <Row gutter={ROW_GUTTER}>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label={getTranslation("sidenav.client.city")}
                    name="city_id"
                    type="select"
                    rules={[
                      {
                        required: true,
                        message: getTranslation("sidenav.client.city_error"),
                      },
                    ]}
                  >
                    <Select
                      className="w-100"
                      style={{ minWidth: 180 }}
                      showSearch
                      options={citiesOptions}
                      filterOption={(input, option) => {
                        return option?.data?.name
                          ?.toLowerCase()
                          .includes(input.toLowerCase());
                      }}
                      onChange={(value) => {
                        const city = citiesOptions.find(
                          (item) => item.value === value
                        );
                        setStateId(city?.data?.state_id);
                        const selectedState = states.find(
                          (item) => item.id === city?.data?.state_id
                        );
                        const selectedCountry = country.find(
                          (item) => item.id === selectedState?.country_id
                        );
                        setCountryId(selectedCountry?.id);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label={getTranslation("sidenav.client.Address")}
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: getTranslation("sidenav.client.Address_error"),
                      },
                    ]}
                  >
                    <Input type="text" name="none" />
                  </Form.Item>
                </Col>
                {location.latitude ? (
                  <>
                    <Col xs={24} sm={24} md={4}>
                      <Form.Item
                        label={getTranslation("sidenav.client.latitude")}
                        name="latitude"
                        rules={[
                          {
                            required: true,
                            message: getTranslation(
                              "sidenav.client.latitude_error"
                            ),
                          },
                        ]}
                      >
                        <InputNumber
                          addonBefore={
                            <AimOutlined
                              className="text-primary"
                              onClick={() => setLocationVisible(true)}
                            />
                          }
                          className="w-full"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={4}>
                      <Form.Item
                        label={getTranslation("sidenav.client.longitude")}
                        name="longitude"
                        rules={[
                          {
                            required: true,
                            message: getTranslation(
                              "sidenav.client.longitude_error"
                            ),
                          },
                        ]}
                      >
                        <InputNumber className="w-full" />
                      </Form.Item>
                    </Col>
                  </>
                ) : (
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label={getTranslation("sidenav.admins.google_map_link")}
                    >
                      <Button
                        onClick={() => setLocationVisible(true)}
                        block
                        icon={<AimOutlined className="text-primary" />}
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label={getTranslation("sidenav.client.company_type")}
                    name="company_type_id"
                    rules={[
                      {
                        required: true,
                        message: getTranslation(
                          "sidenav.client.company_type_error"
                        ),
                      },
                    ]}
                  >
                    <Select
                      className="w-100"
                      style={{ minWidth: 180 }}
                      showSearch
                      options={companyTypeOptions}
                      filterOption={(input, option) => {
                        return option?.data?.name
                          ?.toLowerCase()
                          .includes(input.toLowerCase());
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label={getTranslation("sidenav.client.admins")}
                    name="admins"
                  >
                    <Select
                      {...sharedProps}
                      {...selectProps}
                      notFoundContent={
                        <Empty
                          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                          description={getTranslation("sidenav.admin.empty")}
                        />
                      }
                      maxTagPlaceholder={(omittedValues) => (
                        <Tooltip
                          overlayStyle={{
                            pointerEvents: "none",
                          }}
                          title={omittedValues
                            .map(
                              (omittedValue) =>
                                omittedValue.label.props.children.props
                                  .first_name
                            )
                            .join(", ")}
                        >
                          <span>Hover Me</span>
                        </Tooltip>
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={getTranslation("sidenav.admins.note")}
                    name="note"
                    rules={[
                      {
                        required: false,
                        message: getTranslation("sidenav.admins.note"),
                      },
                    ]}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>
                {/* <Col xs={24} sm={24} md={24}>
                                <Divider orientation="left" orientationMargin="0" >
                                    {getTranslation("sidenav.client.document_photos")}
                                </Divider>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div>
                                        <Upload
                                            onChange={handleChange}
                                            action={`${API_BASE_URL}api/testImage`}
                                            icon="hello"
                                            style={{ height: "300px" }}
                                            type="file"
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList}
                                            onPreview={onPreview}
                                        >
                                            {fileList.length < 3 && getTranslation('sidenav.product.upload')}
                                        </Upload>
                                    </div>

                                </motion.div>
                            </Col> */}
              </Row>
            </Col>
          </Row>
          <Flex gap={10} justifyContent="flex-end">
            <Button onClick={() => close()}>
              {getTranslation("sidenav.client.Cancel")}
            </Button>
            <Button type="primary" loading={isLoading} htmlType="submit">
              {getTranslation("sidenav.client.Edit")}
            </Button>
          </Flex>
        </Form>
      ),
    },
    {
      key: "2",
      label: getTranslation("sidenav.admins.branches_tab_image"),

      children: (
        <EditBranchImage
          onImageEdit={onImageEdit}
          onImageDelete={onImageDelete}
          onSubmit={onSubmit}
          onClose={close}
          data={data}
        />
      ),
    },
  ];
  return (
    <AddOrUpdateLayout
      maskClosable={false}
      open={visible}
      width={900}
      close={close}
      footer={null}
      title={getTranslation("sidenav.client.branch_edit")}
      component={
        <>
          <Tabs defaultActiveKey="1" items={items} />

          {!LocationVisible ? null : (
            <MapBox
              data={[]}
              latitude={location.latitude ? location.latitude : latitude}
              longitude={location.longitude ? location.longitude : longitude}
              visible={LocationVisible}
              enableNewPin={true}
              close={() => setLocationVisible(false)}
              onSubmit={(location) => {
                setLocation({
                  latitude: location.latitude,
                  longitude: location.longitude,
                });
                form.setFieldsValue({
                  longitude: location.longitude,
                  latitude: location.latitude,
                });
              }}
            />
          )}
        </>
      }
    />
  );
};

export default EditBranch;
