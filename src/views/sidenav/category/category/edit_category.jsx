import React from "react";
import { Form, Input, Button, Modal } from "antd";
import Flex from "../../../../components/shared-components/Flex";
import { getTranslation } from "../../../../lang/translationUtils";
import { useDispatch } from "react-redux";
import { edit_category } from "../../../../store/slices/CategorySlice";
import TextArea from "antd/es/input/TextArea";
const EditCategory = (props) => {
  const { close, selectedItem } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        id: selectedItem.id,
        name: values.name,
        description: values.description,
      };
      dispatch(edit_category(data)).then((response) => {
        if (!response.error) {
          close();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal open={true} footer={null} onCancel={close}>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        name="edit category"
        layout="vertical"
        initialValues={{
          name: selectedItem.name,
          description: selectedItem.description,
        }}
        form={form}
      >
        <Form.Item
          label={getTranslation("sidenav.products.category.category_name")}
          name="name"
          rules={[
            {
              required: true,
              message: getTranslation("sidenav.products.category_empty_name"),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={getTranslation(
            "sidenav.products.category.category_description"
          )}
          name="description"
          rules={[
            {
              required: true,
              message: getTranslation(
                "sidenav.products.category_empty_description"
              ),
            },
          ]}
        >
          <TextArea />
        </Form.Item>
        <Flex gap={10} justifyContent="flex-end">
          <Button onClick={() => close()}>
            {getTranslation("sidenav.products.category.Cancel")}
          </Button>
          <Button type="primary" htmlType="submit">
            {getTranslation("sidenav.products.category.Add")}
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default EditCategory;
