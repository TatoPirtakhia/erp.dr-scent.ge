import { Form, Input, Button, Modal, Tabs } from "antd";
import { useDispatch } from "react-redux";
import Flex from "../../../../components/shared-components/Flex";
import { useEffect, useRef, useState } from "react";
import { getTranslation } from "../../../../lang/translationUtils";
import { edit_unit } from "../../../../store/slices/UnitSlice";

const EditUnit = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { onSubmit, visible, close, data } = props;
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const values = await form.validateFields();
      const body = {
        id: data.id,
        name_ka: values.name_ka.trim(),
        name_en: values.name_en ? values.name_en.trim() : null,
      };
      dispatch(edit_unit(body)).then((response) => {
        if (!response.error) {
          onSubmit(body);
          close();
        }
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const tabItems = [
    {
      key: "1",
      label: getTranslation("language_ge"),
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
      label: getTranslation("language_en"),
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
    <Modal
      open={visible}
      onCancel={close}
      footer={null}
      title={getTranslation("sidenav.settings.unit.edit_title")}
    >
      <Form
        name="add unit"
        layout="vertical"
        onFinish={handleSave}
        form={form}
        initialValues={{
          name_ka: data.name_ka,
          name_en: data.name_en,
        }}
      >
        <Tabs defaultActiveKey="1" items={tabItems} />
        <Flex gap={10} justifyContent="flex-end">
          <Button onClick={() => close()}>
            {getTranslation("sidenav.settings.unit.Cancel")}
          </Button>
          <Button type="primary" htmlType="submit">
            {getTranslation("sidenav.settings.unit.Edit")}
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default EditUnit;
