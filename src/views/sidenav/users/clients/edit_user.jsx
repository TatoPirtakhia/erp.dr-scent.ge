import { Form, Input, Button, App, Row, Col, Upload } from "antd";
import { useState, useEffect } from "react";
import Flex from "../../../../components/shared-components/Flex";
import { useDispatch } from "react-redux";
import debouncedValidateEmail from "../../../../utils/emailCheck";
import {
  changeClientImage,
  editClient,
  getAdminsForClient,
} from "../../../../store/slices/UsersSlice";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { UserOutlined, MailOutlined, AimOutlined } from "@ant-design/icons";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import { getTranslation } from "../../../../lang/translationUtils";
import { API_BASE_URL } from "../../../../constants/ApiConstant";
import resizeImage from "../../../../utils/resizeImage";
import TextArea from "antd/es/input/TextArea";
import MapBox from "../../../../Maps";
import AddOrUpdateLayout from "../../../../components/shared-components/add_or_edit_layout";
const EditUser = (props) => {
  const { notification } = App.useApp();
  const { visible, close, onSubmit, data, latitude, longitude } = props;

  const [LocationVisible, setLocationVisible] = useState(false);
  const [location, setLocation] = useState({
    latitude: data.latitude,
    longitude: data.longitude,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [imageSRC, setImageSRC] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const [clients, setClients] = useState([]);
  const [selectedAdminsId, setSelectedAdminsId] = useState(() => {
    const admins = data.admins || [];
    return admins.length > 0
      ? admins.filter((elm) => elm.id !== null).map((elm) => elm.id)
      : [];
  });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data.image) {
      try {
        const fileList = [
          {
            uid: 1,
            name: "image.png",
            status: "done",
            url: `${API_BASE_URL}images/clients/images/user_${data.id}/${data.image}`,
          },
        ];
        setFileList(fileList);
      } catch (error) {
        console.error("Error parsing document_images:", error);
      }
    }
  }, [data]);

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
      setIsLoading(true);
      const values = await form.validateFields();
      const body = {
        id: data.id,
        first_name: values.first_name.trim(),
        brand_name: values.brand_name ? values.brand_name.trim() : "",
        phone1: values.phone1 ? values.phone1.trim().replace(/\s+/g, "") : "",
        phone2: values.phone2 ? values.phone2.trim().replace(/\s+/g, "") : "",
        email: values.email.toLowerCase().trim(),
        personal_id: values.personal_id.trim(),
        user_type: 3,
        note: values.note,
      };

      dispatch(editClient(body)).then(async (response) => {
        if (!response.error) {
          let image_name = "";

          if (image) {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("old_image", data.image);
            await dispatch(changeClientImage({ formData, id: data.id })).then(
              (res) => {
                if (!res.error) {
                  image_name = res.payload.image_name;
                }
              }
            );
          }
          notification.success({
            message: getTranslation("sidenav.client.Done"),
            description: getTranslation(response.payload.message),
          });
          onSubmit({
            ...body,
            salesman: data.salesman,
            image: image_name,
            is_active: data.is_active,
            admins: selectedAdminsId.map((elm) => ({ id: elm })),
          });

          close();
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
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
      setImage(resizedFile);
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
  return (
    <AddOrUpdateLayout
      maskClosable={false}
      open={visible}
      width={700}
      close={close}
      footer={null}
      title={getTranslation("sidenav.client.userAddModalTitle")}
      component={
        <>
          <Form
            name="basicInformation"
            layout="vertical"
            onFinish={handleSave}
            form={form}
            initialValues={{
              first_name: data.first_name,
              brand_name: data.brand_name,
              email: data.email,
              phone1: data.phone1,
              phone2: data.phone2,
              personal_id: data.personal_id,
              company_type_id: data.company_type_id,
              address: data.address,
              note: data.note,
              latitude: data.latitude,
              longitude: data.longitude,
            }}
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={25}>
                <Row gutter={ROW_GUTTER}>
                  <Col xs={24} sm={24} md={24}>
                    <div className="flex justify-center mb-4">
                      <div className="">
                        <Upload
                          onChange={handleChange}
                          action={`${API_BASE_URL}api/testImage`}
                          icon="hello"
                          style={{ height: "100px" }}
                          type="file"
                          accept="image/*"
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={onPreview}
                        >
                          {fileList.length < 1 &&
                            getTranslation("sidenav.product.upload")}
                        </Upload>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label={getTranslation("sidenav.client.FirstName")}
                      name="first_name"
                      rules={[
                        {
                          required: true,
                          message: getTranslation(
                            "sidenav.client.first_name_error"
                          ),
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-primary " />}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label={getTranslation("sidenav.client.brandName")}
                      name="brand_name"
                    >
                      <Input
                        prefix={<UserOutlined className="text-primary " />}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label={getTranslation("sidenav.client.Personal_id")}
                      name="personal_id"
                      rules={[
                        {
                          required: true,
                          message: getTranslation(
                            "sidenav.client.personal_id_error"
                          ),
                        },
                      ]}
                    >
                      <Input type="tel" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label={getTranslation("sidenav.client.Email")}
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: getTranslation(
                            "sidenav.client.email_error_empty"
                          ),
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            const isValidEmail =
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                            if (isValidEmail) {
                              return Promise.resolve();
                            } else {
                              return new Promise((resolve, reject) => {
                                debouncedValidateEmail(
                                  rule,
                                  value,
                                  getTranslation(
                                    "sidenav.client.email_error_validation"
                                  ),
                                  resolve,
                                  reject
                                );
                              });
                            }
                          },
                        }),
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-primary " />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label={getTranslation("sidenav.client.phone")}
                      name="phone1"
                      type="number"
                      rules={[
                        {
                          required: true,
                          message: getTranslation("sidenav.client.phone_error"),
                        },
                        // {
                        //     validator: (rule, value) => {
                        //         if (value) {
                        //             const georgianPhoneNumberRegex = /^5[0-9]{8}$/;
                        //             if (!georgianPhoneNumberRegex.test(value)) {
                        //                 return Promise.reject(`Please enter a valid  phone number`);
                        //             }
                        //         }
                        //         return Promise.resolve();
                        //     },
                        // },
                      ]}
                    >
                      <Input addonBefore={`+995`} type="tel" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label={getTranslation("sidenav.admins.mobile")}
                      name="phone2"
                      rules={[
                        {
                          required: false,
                          message: getTranslation("sidenav.admins.phone_error"),
                        },
                        // {
                        //     validator: (rule, value) => {
                        //         if (value) {
                        //             const georgianPhoneNumberRegex = /^5[0-9]{8}$/;

                        //             if (!georgianPhoneNumberRegex.test(value)) {
                        //                 return Promise.reject(`Please enter a valid  phone number`);
                        //             }
                        //         }

                        //         return Promise.resolve();
                        //     },
                        // },
                      ]}
                    >
                      <Input addonBefore={`+995`} type="tel" />
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

export default EditUser;
