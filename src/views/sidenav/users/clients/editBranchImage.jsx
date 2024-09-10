import { Form, Upload, Button } from "antd";
import { useState, useEffect } from "react";
import { getTranslation } from "../../../../lang/translationUtils";
import { API_BASE_URL } from "../../../../constants/ApiConstant";
import resizeImage from "../../../../utils/resizeImage";
import { useDispatch } from "react-redux";
import { addBranchImage } from "../../../../store/slices/UsersSlice";
const EditBranchImage = (props) => {
  const { data } = props;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageSRC, setImageSRC] = useState(null);
  const [image, setImage] = useState([]);
  const dispatch = useDispatch();
  console.log(data);
  const handleSubmit = async () => {
    try {
      // ! IF image already exists we want to change it
      //   if (image) {
      //     const formData = new FormData();
      //     formData.append("image", image);
      //     formData.append("old_image", data.image);
      //     await dispatch(changeClientImage({ formData, id: data.id })).then(
      //       (res) => {
      //         if (!res.error) {
      //           image_name = res.payload.image_name;
      //         }
      //       }
      //     );
      //   }
      for (const file of image) {
        const formData = new FormData();
        formData.append("image", file);
        console.log(file);
        dispatch(
          addBranchImage({
            formData,
            user_id: data.user_id,
            branch_id: data.id,
            image_id: 0,
          })
        )
          .then((response) => {
            if (!response.error) {
              console.log(" success:", response);
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
  useEffect(() => {
    if (data.image) {
      try {
        const fileList = [
          {
            uid: 1,
            name: "image.png",
            status: "done",
            url: `${API_BASE_URL}images/clients/images/user_${data.id}/${data.image}`,
          },
        ];
        setFileList(fileList);
      } catch (error) {
        console.error("Error parsing document_images:", error);
      }
    }
  }, [data]);
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
        {fileList.length < 1 && getTranslation("sidenav.product.upload")}
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

export default EditBranchImage;
