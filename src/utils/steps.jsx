import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, InputNumber, message, App, Row, Select, Steps, theme, Tooltip, Upload, Spin } from 'antd';
import Flex from '../components/shared-components/Flex';
import { ROW_GUTTER } from '../constants/ThemeConstant';
import { getTranslation } from '../lang/translationUtils';
import {
  UserOutlined,
  MailOutlined,
  AimOutlined,
  LoadingOutlined
} from "@ant-design/icons"
import TextArea from 'antd/es/input/TextArea';
import debouncedValidateEmail from './emailCheck';
import resizeImage from './resizeImage';
import { API_BASE_URL } from '../constants/ApiConstant';
import { changeClientImage } from '../store/slices/UsersSlice';
import { useDispatch } from 'react-redux';
import IsVatPayer from './check_rs';
import { get_vat_payer_info } from '../store/slices/RsSlice';
const StepsWizard = ({ setStateId, setCountry_id, states, country, form, current, clientId, setCurrent, close, click, location, setLocationVisible, clients, selectedAdmins, setSelectedAdmins, companyTypeOptions, citiesOptions, selectedCountry, }) => {
  const { token } = theme.useToken();
  const [form12] = Form.useForm()
  const { notification } = App.useApp()
  const [image, setImage] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageSRC, setImageSRC] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const [fileList, setFileList] = useState([])
  const [clientInfo, setClientInfo] = useState({})
  const handleSave = (values) => {
    setClientInfo(values)
    setCurrent(current + 1)
  }
  const handleSaveAddress = (values) => {
    click({ clientInfo, address: values })
  }

  const handleChange = async ({ fileList: newFileList }) => {

    setFileList(newFileList);
    const info = newFileList[newFileList.length - 1];
    if (!info) return
    if (info && info.status === 'uploading') {
      setLoading(true);
      return;
    }
    try {
      const resizedFile = await resizeImage(info.originFileObj)
      setImage((prev) => [...prev, resizedFile]);
      setImageSRC(URL.createObjectURL(info.originFileObj))
      setLoading(false);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      setLoading(false);
    }
  }
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
      imgWindow.document.write(`<img src="${src}" alt="preview" style="max-width: 100%; max-height: 100%;" />`);
    } else {
      console.error('Failed to open image preview window.');
    }
  };

  const sharedProps = {
    mode: 'multiple',
    style: {
      width: '100%',
    },
    options: clients,
    maxTagCount: 'responsive',
    filterOption: (input, option) => {
      return (
        option?.data?.first_name?.toLowerCase().includes(input.toLowerCase()) ||
        option?.data?.email?.toLowerCase().includes(input.toLowerCase())
      );
    }
  };
  const selectProps = {
    value: selectedAdmins,
    onChange: setSelectedAdmins,
  };

  const dispatch = useDispatch()
  const saveImage = async () => {

    for (const file of image) {
      const formData = new FormData()
      formData.append("image", file)
      await dispatch(changeClientImage({ formData, id: clientId })).then((response) => {
            
      })
    }
    close()
  }

  const [vatPayerName, setVatPayerName] = useState('')
  const [vatPayer, setVatPayer] = useState(false)
  const [loadingVatPayer, setLoadingVatPayer] = useState(false)
  const [checkVatPayer, setCheckVatPayer] = useState(false)

  const is_vat_payer = async () => {
    if(loadingVatPayer) return
    setLoadingVatPayer(true)
    try {
      const values = await form.validateFields(['personal_id']);
      dispatch(get_vat_payer_info(values.personal_id)).then((response) => {
        if (!response.error) {
          setVatPayerName(response.payload.name)
          form.setFieldsValue({
            first_name: response.payload.name === 'is_not_registered' ? '' : response.payload.name
          })
          if (response.payload.name === 'is_not_registered') {
            notification.warning({
              message: getTranslation("Warning!"),
              description: getTranslation("sidenav.client.is_not_registered")
            })
          }
          setVatPayer(response.payload.isVatPayer ? 1 : 0)
          setCheckVatPayer(true)
        }
        setLoadingVatPayer(false)
      })

    } catch (error) { }
  }

  const steps = [
    {
      title: getTranslation("sidenav.client.clientInfo"),
      content:
        <Form
          name="info"
          layout="vertical"
          onFinish={handleSave}
          form={form}
          initialValues={{
            city: '',
            address: '',
            country: "Georgia"
          }}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={25}>
              <Row gutter={ROW_GUTTER}>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label={getTranslation("sidenav.client.FirstName")}
                    name="first_name"
                    rules={[
                      {
                        required: true,
                        message: getTranslation("sidenav.client.first_name_error"),
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined className="text-primary " />} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label={getTranslation("sidenav.client.brandName")}
                    name="brand_name"
                  >
                    <Input prefix={<UserOutlined className="text-primary " />} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label={getTranslation("sidenav.client.Personal_id")}
                    name="personal_id"
                    rules={[
                      {
                        required: true,
                        message: getTranslation("sidenav.client.personal_id_error"),
                      },

                    ]}

                  >
                    <Input 
                    type='tel'
                    suffix={
                      loadingVatPayer ? (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
                      ) : (
                        <IsVatPayer height={20} width={20} onClick={is_vat_payer} />
                      )
                    } />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label={getTranslation("sidenav.client.Email")}
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: getTranslation("sidenav.client.email_error_empty"),
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                          if (isValidEmail) {
                            return Promise.resolve();
                          } else {
                            return new Promise((resolve, reject) => {
                              debouncedValidateEmail(rule, value, getTranslation("sidenav.client.email_error_validation"), resolve, reject);
                            });
                          }
                        },
                      }),
                    ]}
                  >
                    <Input prefix={<MailOutlined className="text-primary " />} />
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
                    <Input addonBefore={`+${selectedCountry.phone_code}`} type="tel" />
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
                    <Input addonBefore={`+${selectedCountry.phone_code}`} type="tel" name="phone" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={getTranslation("sidenav.admins.note")}
                    name="note"
                    rules={[{
                      required: false,
                      message: getTranslation("sidenav.admins.note")
                    }]}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>

              </Row>
            </Col>
          </Row>
          <Flex gap={10} justifyContent="flex-end">
            <Button onClick={() => close()}>{getTranslation("sidenav.client.Cancel")}</Button>
            <Button type="primary" htmlType="submit" >{getTranslation("sidenav.client.next")}</Button>
          </Flex>
        </Form>,
    },
    {
      title: getTranslation("sidenav.client.client_address"),
      content: <Form
        name="basicInformation"
        layout="vertical"
        onFinish={handleSaveAddress}
        form={form12}
      >
        <Row>
          <Col xs={24} sm={24} md={24} lg={25}>
            <Row gutter={ROW_GUTTER}>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label={getTranslation("sidenav.client.city")}
                  name="city_id"
                  type="select"
                  rules={[{ required: true, message: getTranslation("sidenav.client.city_error") }]}
                >
                  <Select
                    className="w-100"
                    style={{ minWidth: 180 }}
                    showSearch
                    options={citiesOptions}
                    filterOption={(input, option) => {
                      return (
                        option?.data?.name?.toLowerCase().includes(input.toLowerCase())
                      );
                    }}
                    onChange={(value) => {
                      const city = citiesOptions.find(item => item.value === value);
                      setStateId(city?.data?.state_id)
                      const selectedState = states.find(item => item.id === city?.data?.state_id);
                      const selectedCountry = country.find(item => item.id === selectedState?.country_id);
                      setCountry_id(selectedCountry?.id)
                    }}
                  />

                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label={getTranslation("sidenav.client.Address")}
                  name="address"
                  rules={[{ required: true, message: getTranslation("sidenav.client.Address_error") }]}
                >
                  <Input type="text" name="none" />
                </Form.Item>
              </Col>
              {location.latitude ? <>
                <Col xs={24} sm={24} md={4}>
                  <Form.Item
                    label={getTranslation("sidenav.client.latitude")}
                    name="latitude"
                    rules={[{ required: true, message: getTranslation("sidenav.client.latitude_error") }]}
                  >
                    <InputNumber addonBefore={<AimOutlined className="text-primary" onClick={() => setLocationVisible(true)} />} className="w-full" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={4}>
                  <Form.Item
                    label={getTranslation("sidenav.client.longitude")}
                    name="longitude"
                    rules={[{ required: true, message: getTranslation("sidenav.client.longitude_error") }]}
                  >
                    <InputNumber className="w-full" />
                  </Form.Item>
                </Col>

              </> : <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label={getTranslation("sidenav.admins.google_map_link")}
                  name="google_map_link"
                >
                  <Button onClick={() => setLocationVisible(true)} block icon={<AimOutlined className="text-primary" />} />
                </Form.Item>
              </Col>}
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label={getTranslation("sidenav.client.company_type")}
                  name="company_type_id"
                  type="select"
                  rules={[{ required: true, message: getTranslation("sidenav.client.company_type_error") }]}
                >
                  <Select
                    className="w-100"
                    style={{ minWidth: 180 }}
                    showSearch
                    options={companyTypeOptions}
                    filterOption={(input, option) => {
                      return (
                        option?.data?.name?.toLowerCase().includes(input.toLowerCase())
                      );
                    }}
                  />

                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label={getTranslation("sidenav.client.admins")}
                  name="clients"
                >
                  <Select
                    {...sharedProps}
                    {...selectProps}
                    maxTagPlaceholder={(omittedValues) => (
                      <Tooltip
                        overlayStyle={{
                          pointerEvents: 'none',
                        }}
                        title={omittedValues.map((omittedValue) => omittedValue.label.props.children.props.first_name).join(', ')}
                      >
                        <span>Hover Me</span>
                      </Tooltip>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Flex gap={10} justifyContent="justify-between">
          <Button disabled type='primary'>{getTranslation("sidenav.client.skip")}</Button>
          <div className='flex flex-col md:flex-row justify-end gap-3 w-full'>
            <Button onClick={() => setCurrent(current - 1)}>{getTranslation("sidenav.client.previous")}</Button>
            <Button type="primary" htmlType="submit" >{getTranslation("sidenav.client.save")}</Button>
          </div>
        </Flex>
      </Form>,
    },
    {
      title: getTranslation("sidenav.client.images"),
      content: <div>
        <div >
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
            {fileList.length < 1 && getTranslation('sidenav.product.upload')}
          </Upload>
        </div>
        <Flex gap={10} justifyContent="justify-between">
          <div className='flex flex-col md:flex-row justify-end gap-3 w-full'>
            <Button onClick={() => close()} >{getTranslation("sidenav.client.skip")}</Button>
            <Button type="primary" onClick={saveImage} >{getTranslation("sidenav.client.save")}</Button>
          </div>
        </Flex>
      </div>
    }
  ];



  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: '100px',
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
  };
  return (
    <>
      <Steps type='navigation' current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
    </>
  );
};
export default StepsWizard;