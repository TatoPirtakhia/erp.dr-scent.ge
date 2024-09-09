import { Select, Input, Button, Form, Row, Col, Modal, Divider } from "antd"
import 'dayjs/locale/ka';
import Flex from "../components/shared-components/Flex"
import {
    CopyOutlined
} from "@ant-design/icons"
import { ROW_GUTTER } from "../constants/ThemeConstant"
import { App } from 'antd';
import { CountUp } from "use-count-up";
import translate from "../translate/tr_function";
import { useTranslation } from "react-i18next";

const ShowInfo = (props) => {
    const [form] = Form.useForm()
    const { t } = useTranslation()
    const { message } = App.useApp();
    const { visible, close, data } = props
    const handleCopy = (value) => {
        navigator.clipboard.writeText(value);
        message.success(`${value}`)
    }
    return (
        <Modal open={visible} onCancel={close} footer={false}  >
            <Form
                name="showInfo"
                layout="vertical"
                form={form}
                style={{ marginTop: "20px" }}
                initialValues={data}
            >
                <Row>
                    <Col xs={24} sm={24} md={24} lg={25}>
                        <Row gutter={ROW_GUTTER}>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item label={translate(t,'FirstName')} name="first_name">
                                    <Input

                                        readOnly
                                        suffix={<CopyOutlined style={{ cursor: 'pointer' }} onClick={() => handleCopy(data.first_name)} />}

                                    />
                                </Form.Item>
                            </Col>
                            {data.category === 'person' ? <Col xs={24} sm={24} md={12}>
                                <Form.Item
                                    label={translate(t,"LastName" )}
                                    name="last_name"
                                >
                                    <Input
                                        suffix={<CopyOutlined style={{ cursor: 'pointer' }} onClick={() => handleCopy(data.last_name)}
                                        />}

                                        readOnly />
                                </Form.Item>
                            </Col> : ''}


                            <Col xs={24} sm={24} md={12}>
                                <Form.Item
                                    label={translate(t,"Email" )}
                                    name="email"
                                >
                                    <Input
                                        suffix={<CopyOutlined style={{ cursor: 'pointer' }} onClick={() => handleCopy(data.email)} />}
                                        readOnly />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item
                                    label={translate(t,"PhoneNumber" )}
                                    name="phone"
                                >
                                    <Input
                                        suffix={<CopyOutlined style={{ cursor: 'pointer' }} onClick={() => handleCopy(data.phone)} />}
                                        readOnly
                                        prefix="+995" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item
                                    label={translate(t,"Personal_id")}
                                    name="personal_id"
                                >
                                    <Input
                                        suffix={<CopyOutlined style={{ cursor: 'pointer' }} onClick={() => handleCopy(data.personal_id)} />}
                                        readOnly
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item label={translate(t,"city" )} name="city">
                                    <Input suffix={<CopyOutlined style={{ cursor: 'pointer' }} onClick={() => handleCopy(data.city)} />} readOnly />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item label={translate(t,"Address" )} name="address">
                                    <Input
                                        suffix={<CopyOutlined style={{ cursor: 'pointer' }} onClick={() => handleCopy(data.address)} />}

                                        readOnly />
                                </Form.Item>
                            </Col>

                        </Row>
                    </Col>
                </Row>
                <Flex gap={10} justifyContent="end">
                    <Button onClick={() => close()}>{translate(t,"Close" )}</Button>
                </Flex>
            </Form>
        </Modal>
    )

}

export default ShowInfo