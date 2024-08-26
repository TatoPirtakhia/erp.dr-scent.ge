import { Form, Input, Button, Modal, Tabs } from "antd"
import { useDispatch } from "react-redux"
import Flex from "../../../../components/shared-components/Flex"
import { useEffect, useRef, useState } from "react"
import { getTranslation } from "../../../../lang/translationUtils"
import { add_unit } from "../../../../store/slices/UnitSlice"

const AddUnit = (props) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const { onSubmit, visible, close } = props
    const [loading, setLoading] = useState(false)

    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current && inputRef.current.focus();
    }, []);

    const handleSave = async () => {
        if (loading) return

        setLoading(true)
        try {
            const values = await form.validateFields()

            dispatch(add_unit({
                name_ka: values.name_ka.trim(),
                name_en: values.name_en ? values.name_en.trim() : null,
            })).then((response) => {
                if (!response.error) {
                    onSubmit(response.payload.data)
                    close()
                }
                setLoading(false)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const tabItems = [
        {
            key: "1",
            label: getTranslation('language_ge'),
            children: (
                <Form.Item
                    label={getTranslation("sidenav.settings.unit.name")}
                    name="name_ka"
                    rules={[
                        {
                            required: true,
                            message: getTranslation("sidenav.settings.unit.name_error"),
                        },
                    ]}
                >
                    <Input ref={inputRef} />
                </Form.Item>
            ),
        },
        {
            key: "2",
            label: getTranslation('language_en'),
            children: (
                <Form.Item
                    label={getTranslation("sidenav.settings.unit.name")}
                    name="name_en"
                >
                    <Input />
                </Form.Item>
            ),
        },
    ];

    return (
        <Modal open={visible} onCancel={close} footer={null}>
            <Form
                name="add category"
                layout="vertical"
                onFinish={handleSave}
                form={form}
            >
                <Tabs defaultActiveKey="1" items={tabItems} />
                <Flex gap={10} justifyContent="flex-end">
                    <Button onClick={() => close()}>{getTranslation("sidenav.settings.unit.Cancel")}</Button>
                    <Button type="primary" htmlType="submit">{getTranslation("sidenav.settings.unit.Add")}</Button>
                </Flex>
            </Form>
        </Modal>
    )
}

export default AddUnit
