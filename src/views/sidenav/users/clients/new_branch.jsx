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
  Upload,
} from "antd";
import { useState, useEffect } from "react";
import Flex from "../../../../components/shared-components/Flex";
import { useDispatch } from "react-redux";
import {
  addBranch,
  addDocumentImage,
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
import resizeImage from "../../../../utils/resizeImage";
import MapBox from "../../../../Maps";
import { getCompanyType } from "../../../../store/slices/companyTypeSlice";
import { getCities } from "../../../../store/slices/CitiesSlice";
import { Tabs } from "antd";
import ImageUpload from "./imageUpload";
const NewBranch = (props) => {
  const { notification } = App.useApp();
  const { visible, close, onSubmit, longitude, latitude, data } = props;
  const [LocationVisible, setLocationVisible] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [imageSRC, setImageSRC] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [country, setCountry] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [states, setStates] = useState([]);
  const [statesOptions, setStatesOptions] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [companyTypeOptions, setCompanyTypeOptions] = useState([]);
  const [submitted, hasSubmitted] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  //! To manage which tab is active
  const [activeTabKey, setActiveTabKey] = useState("1");

  useEffect(() => {
    dispatch(getCountries()).then((response) => {
      if (!response.error) {
        setCountry(response.payload.countries);
        setSelectedCountry(
          response.payload.countries.find((elm) => elm.id === 81)
        );
        setCountryOptions(
          response.payload.countries.map((elm) => ({
            value: elm.id,
            data: elm,
            label: (
              <Flex gap={5} alignItems="center">
                <div>
                  {
                    <img
                      src={elm.image}
                      alt={elm.name}
                      width={20}
                      height={20}
                    />
                  }
                </div>
                {`${elm.name}`}
              </Flex>
            ),
          }))
        );
      }
    });
  }, []);

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
    dispatch(
      getCities({
        country_id: null,
        state_id: null,
      })
    ).then((response) => {
      if (!response.error) {
        setCities(response.payload.cities);
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
    dispatch(getRegions()).then((response) => {
      if (!response.error) {
        setStates(response.payload.states);
        setStatesOptions(
          response.payload.states.map((elm) => ({
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
  }, [countryId]);

  useEffect(() => {
    dispatch(getAdminsForClient()).then((response) => {
      if (!response.error) {
        setAdmins(
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
  }, [cityId]);

  const [newBranch, setNewbranch] = useState({});
  const handleSave = async () => {
    if (isLoading) return;
    try {
      // setIsLoading(true)
      const values = await form.validateFields();
      const body = {
        user_id: data.id,
        address: values.address.trim(),
        longitude: values.longitude,
        latitude: values.latitude,
        company_type_id: values.company_type_id,
        country_id: countryId,
        state_id: stateId,
        city_id: values.city_id,
        selectedUsers: values.admins,
      };
      dispatch(addBranch(body)).then(async (response) => {
        if (!response.error) {
          notification.success({
            message: getTranslation("Done!"),
            description: getTranslation(response.payload.message),
          });
          setActiveTabKey("2");
          hasSubmitted(true);
          setNewbranch(response.payload.data.expandableData[0].id);
          onSubmit({
            ...response.payload.data,
          });
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
    options: admins,
    maxTagCount: "responsive",
    filterOption: (input, option) => {
      return (
        option?.data?.first_name?.toLowerCase().includes(input.toLowerCase()) ||
        option?.data?.email?.toLowerCase().includes(input.toLowerCase())
      );
    },
  };
  const selectProps = {
    value: selectedAdmins,
    onChange: setSelectedAdmins,
  };

  const handleChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const info = newFileList[newFileList.length - 1];
    if (!info) return;
    if (info && info.status === "uploading") {
      setLoading(true);
      return;
    }
    try {
      const resizedFile = await resizeImage(info.originFileObj);
      setImage((prev) => [...prev, resizedFile]);
      setImageSRC(URL.createObjectURL(info.originFileObj));
      setLoading(false);
    } catch (error) {
      console.error("Error converting image to base64:", error);
      setLoading(false);
    }
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const imgWindow = window.open();
    if (imgWindow) {
      imgWindow.document.write(
        `<img src="${src}" alt="preview" style="max-width: 100%; max-height: 100%;" />`
      );
    } else {
      console.error("Failed to open image preview window.");
    }
  };
  // Tab items

  return (
    <Modal
      maskClosable={false}
      open={visible}
      width={900}
      onCancel={close}
      footer={null}
      title={`${getTranslation("sidenav.client.new_branch")}`}
    >
      {/* <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} items={items} /> */}
      {submitted ? (
        <ImageUpload
          onClose={close}
          data={{ user_id: data.id, branch_id: newBranch }}
        />
      ) : (
        <Form
          name="basicInformation"
          layout="vertical"
          onFinish={handleSave}
          form={form}
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
                      name="google_map_link"
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
                    type="select"
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
              {getTranslation("sidenav.settings.unit.Cancel")}
            </Button>
            <Button type="primary" htmlType="submit">
              {getTranslation("sidenav.settings.unit.Add")}
            </Button>
          </Flex>
        </Form>
      )}
    </Modal>
  );
};

export default NewBranch;

// aq gaagrdzele axla shenaxvis dros arunda daixuros modali da mopmdevno tabi unda gaixsnas da im mopsuli infos micem da sheinaxav fotoebs an gamortavs da vso potoebs aratviertavs

// aq shignit tviton filialis redaqtoirebashic unda daamato eg tabi da aq pirdapir gaq vinaa da ra filiali gaq propsebshi gaatan infos da amoigeb mere iq

// ecade xvalamde  qna   ok ?
// ok
