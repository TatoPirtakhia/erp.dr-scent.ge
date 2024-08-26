import { Form, Input, Row, Col, Button, App, Modal, Upload, Select, Radio } from "antd"
import { ROW_GUTTER } from "../../../../constants/ThemeConstant"
import { useDispatch, useSelector } from "react-redux"
import Flex from "../../../../components/shared-components/Flex"
import { add_product, getProductCategory, removeImage } from "../../../../store/slices/ProductSlice"
import resizeImage from "../../../../utils/resizeImage"
import { useEffect, useRef, useState } from "react"
import { API_BASE_URL } from "../../../../constants/ApiConstant"
import { RetweetOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea"
import { edit_product } from "../../../../store/slices/ProductSlice"
import { getTranslation } from "../../../../lang/translationUtils"
import Card from "../../../../components/shared-components/Card"
import { get_unit } from "../../../../store/slices/UnitSlice"
import generateRandomString from "../../../../utils/generateRandomNumber"
import AddOrUpdateLayout from "../../../../components/shared-components/add_or_edit_layout"
const EditProduct = (props) => {
    const dispatch = useDispatch()
    const locale = useSelector((state) => state.theme.locale);
    const { notification } = App.useApp()
    const [form] = Form.useForm()
    const { onSubmit, visible, close, data, isCopy } = props
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false);
    const [value1, setValue1] = useState(data.sell_type);
    const [category, setCategory] = useState([])
    const [categoryOptions, setCategoryOptions] = useState([])
    const [selectedCategory, setSelectedCategory] = useState({})

    const [unitOptions, setUnitOptions] = useState([])
    const [selectedUnit, setSelectedUnit] = useState({ id: parseInt(data.unit_id), name: getTranslation(locale === 'ka' ? data.name_ka : data.name_en) })
    const [unit, setUnit] = useState([])

    const [fileList, setFileList] = useState([{
        uid: '2',
        name: 'image.png',
        status: 'done',
        url: data.image ? `${API_BASE_URL}images/products/${data.image}` : '',
    }])
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

    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current && inputRef.current.focus();
        dispatch(get_unit())
            .then((response) => {
                if (!response.error) {
                    setUnitOptions(response.payload.data.map(item => ({ label: locale === 'ka' ? item.name_ka :  item.name_en, value: item.id })))
                    setUnit(response.payload.data)
                }
            })
        dispatch(getProductCategory()).then((response) => {
            if (!response.error) {
                setCategory(response.payload)
                setCategoryOptions(response.payload.map(item => ({ label: item.name, value: item.id })))
            }
        })
    }, []);
    const [imageSRC, setImageSRC] = useState(data.image ? `${API_BASE_URL}images/products/${data.image}` : '')
    const onChange1 = ({ target: { value } }) => {
        setValue1(value);
    };
    const handleSave = async () => {
        try {
            const values = await form.validateFields()
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("unit_id", parseInt(values.unit))
            formData.append("product_code", values.product_code)
            formData.append("secondary_code", values.secondary_code)
            formData.append("volume", parseFloat(values.volume) || null)
            formData.append("category_id", values.category_id)
            formData.append("sell_type", values.sell_type)
            formData.append("description", values.description)
            if (fileList.length > 0 && image) {
                formData.append("image", image);
            } else {
                formData.append("image", null);
            }
            if (loading) {
                return
            }
            if (image === null && imageSRC === null) {
                dispatch(removeImage({ image: data.image, type: "product" }))
            }


            if (isCopy) {
                const img = image ? '' : data.image
                formData.append("imageName", img)

                dispatch(add_product(formData)).then((response) => {
                    if (!response.error) {
                        onSubmit({
                            ...response.payload.data,
                            category_name: selectedCategory.name ? selectedCategory.name : data.category_name,
                            unit_name: locale === 'ka' ? selectedUnit.name_ka : selectedUnit.name_en
                        })
                        close()
                    }
                })
            } else {
                dispatch(edit_product({ formData, id: data.id })).then((response) => {
                    if (!response.error) {
                        notification.success({
                            message: getTranslation("Updated!"),
                            description: getTranslation(response.payload.message),
                        })
                        onSubmit({
                            ...response.payload.data,
                            category_name: selectedCategory.name ? selectedCategory.name : data.category_name,
                            unit_name: locale === 'ka' ? selectedUnit.name_ka : selectedUnit.name_en,
                        })
                        close()
                    }
                })
            }


        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = async ({ fileList: newFileList }) => {

        setFileList(newFileList);

        const info = newFileList[newFileList.length - 1];
        if (info && info.status === 'uploading') {
            setLoading(true);
            return;
        }
        try {
            const resizedFile = await resizeImage(info.originFileObj)
            setImage(resizedFile);
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

    const generateNumber = () => {
        const randomNumber = generateRandomString(13, true, false, true);
        form.setFieldsValue({ product_code: randomNumber });
    };
    const generateSecondNumber = () => {
        const randomNumber = generateRandomString(13, false, false, true);
        form.setFieldsValue({ secondary_code: randomNumber });
    };


    return (
        <AddOrUpdateLayout
            title={getTranslation("sidenav.product.productEdit_title")}
            maskClosable={true}
            open={visible}
            close={close}
            footer={null}
            width={600}
            component={<>
                <Form
                    name="add category"
                    layout="vertical"
                    onFinish={handleSave}
                    initialValues={{
                        name: data.name,
                        description: data.description || '',
                        unit: parseInt(selectedUnit.id),
                        product_code: data.product_code || '',
                        secondary_code: data.secondary_code || '',
                        category_id: parseInt(data.category_id),
                        sell_type: data.sell_type,
                    }}
                    form={form}
                >
                    <Row className="md:pt-[30px]">
                        <Col xs={24} sm={24} md={24} lg={25}>
                            <Row gutter={ROW_GUTTER}>
                                <Col xs={24} sm={24} md={24}>
                                    <Card title={getTranslation("sidenav.product.info")}>
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
                                                        {fileList.length < 1 && getTranslation('sidenav.product.upload')}
                                                    </Upload>
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <Col xs={24} sm={24} md={24}>
                                                    <Form.Item
                                                        label={getTranslation("sidenav.product.product_name")}
                                                        name="name"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: getTranslation("sidenav.product.product_name_error"),
                                                            },
                                                        ]}
                                                    >
                                                        <Input ref={inputRef} />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} sm={24} md={24}>
                                                    <Form.Item
                                                        label={getTranslation("sidenav.product.product_description")}
                                                        name="description"
                                                    >
                                                        <TextArea autoSize />
                                                    </Form.Item>
                                                </Col>
                                            </div>

                                        </div>
                                    </Card>
                                    <Card title={getTranslation("sidenav.product.details")}>
                                        <Row gutter={16}>
                                            <Col xs={24} sm={24} md={12}>
                                                <Form.Item
                                                    label={getTranslation("sidenav.product.units")}
                                                    name="unit"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: getTranslation("sidenav.product.unit_error"),
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        options={unitOptions}
                                                        onChange={(value) => {
                                                            const selected = unit.find((unit) => unit.id === value)
                                                            setSelectedUnit({ id: selected.id, name: selected.name })
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
                                                            message: getTranslation("sidenav.product.unit_error"),
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        options={categoryOptions}
                                                        filterOption={(input, option) => {
                                                            return (
                                                                option?.data?.name?.toLowerCase().includes(input.toLowerCase())
                                                            );
                                                        }}
                                                        onChange={(value) => {
                                                            const selected = category.find((category) => category.id === value)
                                                            setSelectedCategory(selected)
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={12}>
                                                <Form.Item
                                                    label={getTranslation("sidenav.product.product_code")}
                                                    name="product_code"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: getTranslation("sidenav.product.product_code_error"),
                                                        },
                                                    ]}
                                                >
                                                    <Input addonAfter={
                                                        <RetweetOutlined
                                                            style={{ fontSize: "23px" }}
                                                            onClick={() => generateNumber()}
                                                        />
                                                    } />

                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} sm={24} md={12}>
                                                <Form.Item
                                                    label={getTranslation("sidenav.product.secondary_code")}
                                                    name={("secondary_code")}
                                                >
                                                    <Input addonAfter={
                                                        <RetweetOutlined
                                                            style={{ fontSize: "23px" }}
                                                            onClick={() => generateSecondNumber()}
                                                        />
                                                    } />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} sm={24} md={12}>
                                                <Form.Item
                                                    label={getTranslation("sidenav.product.sell_type")}
                                                    name="sell_type"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: getTranslation("sidenav.product.sell_type_error"),
                                                        },
                                                    ]}
                                                >
                                                    <Radio.Group className="flex flex-col gap-2" options={plainOptions} onChange={onChange1} value={value1} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Flex gap={10} justifyContent="flex-end">
                        <Button onClick={() => close()}>{getTranslation("sidenav.product.Cancel")}</Button>
                        <Button type="primary" htmlType="submit">{getTranslation(isCopy ? "sidenav.product.Add" : "sidenav.product.Edit")}</Button>
                    </Flex>
                </Form>
            </>}
        />
    )
}

export default EditProduct
