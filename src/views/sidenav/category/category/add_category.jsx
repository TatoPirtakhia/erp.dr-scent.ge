import { Form, Input, Button } from "antd";
import Flex from "../../../../components/shared-components/Flex";
import AddOrUpdateLayout from "../../../../components/shared-components/add_or_edit_layout";
import { useDispatch } from "react-redux";
import { add_category } from "../../../../store/slices/CategorySlice";
import { getTranslation } from "../../../../lang/translationUtils";
import TextArea from "antd/es/input/TextArea";

const AddCategory = (props) => {
  const dispatch = useDispatch();
  const { close } = props;
  const [form] = Form.useForm();

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const { name, description } = values;
      dispatch(add_category({ name, description })).then((response) => {
        if (!response.error) {
          close();
        }
      });
    } catch (error) {
      console.log(`Something Went wrong ${error}`);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <AddOrUpdateLayout
      markCloasble={true}
      footer={null}
      width={600}
      open={true}
      close={close}
      title={getTranslation("sidenav.products.category_add_title")}
      component={
        <>
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            name="add product"
            layout="vertical"
            form={form}
          >
            <Form.Item
              label={getTranslation("sidenav.products.category.category_name")}
              name="name"
              rules={[
                {
                  required: true,
                  message: getTranslation(
                    "sidenav.products.category_empty_name"
                  ),
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
        </>
      }
    ></AddOrUpdateLayout>
  );
};

export default AddCategory;
