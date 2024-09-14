import { Form, Upload, Button, App } from "antd";
import { useState } from "react";
import { getTranslation } from "../../../../lang/translationUtils";
import { API_BASE_URL } from "../../../../constants/ApiConstant";
import resizeImage from "../../../../utils/resizeImage";
import { useDispatch } from "react-redux";
import { addBranchImage } from "../../../../store/slices/UsersSlice";
const ImageUpload = (props) => {
  const { data, onClose } = props;
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageSRC, setImageSRC] = useState(null);
  const [image, setImage] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      for (const file of image) {
        const formData = new FormData();
        formData.append("image", file);
        dispatch(
          addBranchImage({
            formData,
            user_id: data.user_id,
            branch_id: data.branch_id,
            image_id: 0,
          })
        )
          .then((response) => {
            if (!response.error) {
              notification.success({
                message: getTranslation(
                  "sidenav.client.branch_image_add_success"
                ),
                description: getTranslation(response.payload.message),
              });
              onClose();
            } else {
              console.error(" failed:", response.error);
            }
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      }
    } catch (error) {
      console.log("Form submission failed:", error);
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
      setImage([resizedFile]);
      setImageSRC(URL.createObjectURL(info?.originFileObj));
      setLoading(false);
    } catch (error) {
      console.error("Error converting image to base64:", error);
      setLoading(false);
    }
  };
  return (
    <>
      <Upload
        action={`${API_BASE_URL}api/testImage`}
        onChange={handleChange}
        style={{ height: "300px" }}
        type="file"
        accept="image/*"
        listType="picture-card"
        fileList={fileList}
        multiple
        onPreview={onPreview}
      >
        {fileList.length < 20 && getTranslation("sidenav.product.upload")}
      </Upload>
      <Button
        type="primary"
        loading={loading}
        onClick={() => handleSubmit()}
        style={{ marginTop: 16 }}
      >
        {getTranslation("sidenav.product.upload")}
      </Button>
    </>
  );
};

export default ImageUpload;
