import React from "react";
import { Form, Input, Button, Modal } from "antd";
import { getTranslation } from "../../../../lang/translationUtils";

const EditServiceSettings = (props) => {
  const { onClose, data } = props;
  const [form] = Form.useForm();
  const handleSave = () => {
    console.log("Editing work");
  };
  return (
    <Modal
      title={getTranslation("sidenav.settings.Unit.service_edit")}
      footer={null}
      open={true}
      onCancel={onClose}
    >
      <Form
        // initialValues={
        //   // Add initial Values here
        // }
        form={form}
        onFinish={handleSave}
        layout="vertical"
        name="Add Service Settings"
      >
        <Form.Item
          label="Name"
          rules={[
            {
              required: true,
              message: "Name cannot be empty",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          rules={[
            {
              required: true,
              message: "Description cannot be empty",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <div className="flex flex-1 justify-end gap-3">
          <Button onClick={() => onClose()}>
            {getTranslation("sidenav.product.Cancel")}
          </Button>
          <Button type="primary" htmlType="submit">
            {getTranslation("sidenav.product.Add")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditServiceSettings;
