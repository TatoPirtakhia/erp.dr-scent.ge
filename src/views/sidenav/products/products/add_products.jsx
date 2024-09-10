import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Modal,
  Upload,
  Card,
  Select,
  InputNumber,
  Radio,
} from "antd";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { useDispatch, useSelector } from "react-redux";
import Flex from "../../../../components/shared-components/Flex";
import { useEffect, useRef, useState } from "react";
import resizeImage from "../../../../utils/resizeImage";
import TextArea from "antd/es/input/TextArea";
import { API_BASE_URL } from "../../../../constants/ApiConstant";
import {
  add_product,
  getProductCategory,
} from "../../../../store/slices/ProductSlice";
import { getTranslation } from "../../../../lang/translationUtils";
import { get_unit } from "../../../../store/slices/UnitSlice";
import generateRandomString from "../../../../utils/generateRandomNumber";
import { RetweetOutlined } from "@ant-design/icons";
import AddOrUpdateLayout from "../../../../components/shared-components/add_or_edit_layout";
const AddProduct = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const locale = useSelector((state) => state.theme.locale);
  const { onSubmit, visible, close } = props;
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [imageSRC, setImageSRC] = useState(null);

  const [category, setCategory] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState({});

  const [unitOptions, setUnitOptions] = useState([]);
  const [unit, setUnit] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState({});
  const plainOptions = [
    {
      label: getTranslation("sidenav.products.sell"),
      value: 1,
    },
    {
      label: getTranslation("sidenav.products.rent"),
      value: 2,
    },
  ];

  const [value1, setValue1] = useState(1);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
    dispatch(get_unit()).then((response) => {
      if (!response.error) {
        setUnitOptions(
          response.payload.data.map((item) => ({
            label: locale === "ka" ? item.name_ka : item.name_en,
            value: item.id,
          }))
        );
        setUnit(response.payload.data);
      }
    });

    dispatch(getProductCategory()).then((response) => {
      if (!response.error) {
        setCategory(response.payload);
        setCategoryOptions(
          response.payload.map((item) => ({ label: item.name, value: item.id }))
        );
      }
    });
  }, []);

  const onChange1 = ({ target: { value } }) => {
    setValue1(value);
  };
  const handleSave = async () => {
    if (isLoading) return;
    // setIsLoading(true)
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("unit_id", parseInt(values.unit));
      formData.append("volume", parseFloat(values.volume) || null);
      formData.append("product_code", values.product_code);
      formData.append("secondary_code", values.secondary_code);
      formData.append("category_id", values.category_id);
      formData.append("sell_type", values.sell_type);
      formData.append("description", values.description);
      if (fileList.length > 0) {
        formData.append("image", image);
      } else {
        formData.append("image", null);
      }
      if (loading) {
        return;
      }
      dispatch(add_product(formData)).then((response) => {
        if (!response.error) {
          onSubmit({
            ...response.payload.data,
            category_name: selectedCategory.name,
            unit_name: selectedUnit.name,
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
      const resizedFile = await resizeImage(info?.originFileObj);
      setImage(resizedFile);
      setImageSRC(URL.createObjectURL(info?.originFileObj));
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

  const generateNumber = () => {
    const randomNumber = generateRandomString(13, false, false, true);
    form.setFieldsValue({ product_code: randomNumber });
  };
  const generateSecondNumber = () => {
    const randomNumber = generateRandomString(13, false, false, true);
    form.setFieldsValue({ secondary_code: randomNumber });
  };
  console.log(`Add product ${fileList}`);

  return (
    <AddOrUpdateLayout
      title={getTranslation("sidenav.product.product_add_title")}
      maskClosable={true}
      open={visible}
      close={close}
      footer={null}
      width={600}
      component={
        <>
          <Form
            name="add product"
            layout="vertical"
            onFinish={handleSave}
            form={form}
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={25}>
                <Row gutter={ROW_GUTTER}>
                  <Col xs={24} sm={24} md={24}>
                    <Card>
                      <div className="flex flex-col md:flex-row w-full gap-2">
                        <div className="flex justify-center md:items-center">
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
                              {fileList.length < 1 &&
                                getTranslation("sidenav.product.upload")}
                            </Upload>
                          </div>
                        </div>
                        <div className="w-full">
                          <Col xs={24} sm={24} md={24}>
                            <Form.Item
                              label={getTranslation(
                                "sidenav.product.product_name"
                              )}
                              name="name"
                              rules={[
                                {
                                  required: true,
                                  message: getTranslation(
                                    "sidenav.product.product_name_error"
                                  ),
                                },
                              ]}
                            >
                              <Input ref={inputRef} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24}>
                            <Form.Item
                              label={getTranslation(
                                "sidenav.product.product_description"
                              )}
                              name="description"
                            >
                              <TextArea />
                            </Form.Item>
                          </Col>
                        </div>
                      </div>
                    </Card>
                    <Card>
                      <Row gutter={16}>
                        <Col xs={24} sm={24} md={12}>
                          <Form.Item
                            label={getTranslation("sidenav.product.units")}
                            name="unit"
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "sidenav.product.unit_error"
                                ),
                              },
                            ]}
                          >
                            <Select
                              options={unitOptions}
                              onChange={(value) => {
                                const selected = unit.find(
                                  (unit) => unit.id === value
                                );
                                setSelectedUnit({
                                  id: selected.id,
                                  name:
                                    locale === "ka"
                                      ? selected.name_ka
                                      : selected.name_en,
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                          <Form.Item
                            label={getTranslation("sidenav.products.category")}
                            name="category_id"
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "sidenav.product.unit_error"
                                ),
                              },
                            ]}
                          >
                            <Select
                              options={categoryOptions}
                              filterOption={(input, option) => {
                                return option?.data?.name
                                  ?.toLowerCase()
                                  .includes(input.toLowerCase());
                              }}
                              onChange={(value) => {
                                const selected = category.find(
                                  (category) => category.id === value
                                );
                                setSelectedCategory(selected);
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                          <Form.Item
                            label={getTranslation(
                              "sidenav.product.product_code"
                            )}
                            name="product_code"
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "sidenav.product.product_code_error"
                                ),
                              },
                            ]}
                          >
                            <Input
                              addonAfter={
                                <RetweetOutlined
                                  style={{ fontSize: "23px" }}
                                  onClick={() => generateNumber()}
                                />
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                          <Form.Item
                            label={getTranslation(
                              "sidenav.product.secondary_code"
                            )}
                            name={"secondary_code"}
                          >
                            <Input
                              addonAfter={
                                <RetweetOutlined
                                  style={{ fontSize: "23px" }}
                                  onClick={() => generateSecondNumber()}
                                />
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                          <Form.Item
                            label={getTranslation("sidenav.product.sell_type")}
                            name="sell_type"
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "sidenav.product.sell_type_error"
                                ),
                              },
                            ]}
                          >
                            <Radio.Group
                              className="flex flex-col gap-2"
                              options={plainOptions}
                              onChange={onChange1}
                              value={value1}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Flex gap={10} justifyContent="flex-end">
              <Button onClick={() => close()}>
                {getTranslation("sidenav.product.Cancel")}
              </Button>
              <Button type="primary" htmlType="submit">
                {getTranslation("sidenav.product.Add")}
              </Button>
            </Flex>
          </Form>
        </>
      }
    />
  );
};

export default AddProduct;
