import { Form, Upload, Button, Flex, App } from "antd";
import { useState, useEffect } from "react";
import { getTranslation } from "../../../../lang/translationUtils";
import { API_BASE_URL } from "../../../../constants/ApiConstant";
import resizeImage from "../../../../utils/resizeImage";
import { useDispatch } from "react-redux";
import {
  addBranchImage,
  deleteBranchImage,
} from "../../../../store/slices/UsersSlice";
const EditBranchImage = (props) => {
  const { notification } = App.useApp();
  const { data, onClose, onSubmit, onImageEdit, onImageDelete } = props;
  const [form] = Form.useForm();
  const [deletedImageId, setDeletedImageId] = useState([]);
  const [imageIds, setImageIds] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageSRC, setImageSRC] = useState(null);
  const [image, setImage] = useState([]);
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    try {
      if (imageIds.length > 0) {
        handleImageRemoval();
      }
      console.log(image);
      for (const file of image) {
        const formData = new FormData();
        formData.append("image", file);
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
              onImageEdit({
                user_id: data.user_id,
                branch_id: data.id,
                id: response.payload.id,
                image: response.payload.image,
              });
              notification.success({
                message: getTranslation("Done!"),
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
    if (!info);
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
    if (data.images) {
      try {
        const fileList = data.images.map((img, index) => ({
          uid: img.id,
          name: `image_${index}.png`,
          status: "done",
          url: `${API_BASE_URL}images/clients/images/user_${data.user_id}/branch_${img.branch_id}/${img.image}`,
        }));

        setFileList(fileList);
      } catch (error) {
        console.error("Error parsing document_images:", error);
      }
    }
  }, [data]);
  const onRemove = async (file) => {
    setImageIds((prev) => [...prev, file.uid]);
  };
  const handleImageRemoval = () => {
    try {
      dispatch(deleteBranchImage({ imageIds, user_id: data.user_id })).then(
        (response) => {
          if (!response.error) {
            onImageDelete(imageIds);
            onClose();
            notification.success({
              message: getTranslation("Done!"),
              description: getTranslation(response.payload.message),
            });
          }
        }
      );
    } catch (error) {
      console.log("Image could not be deleted", error);
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
        onRemove={onRemove}
      >
        {fileList.length < 20 && getTranslation("sidenav.product.upload")}
      </Upload>
      <div className="flex justify-end gap-4 mt-4">
        <Button onClick={onClose} type="">
          {getTranslation("sidenav.service.Cancel")}
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          {getTranslation("sidenav.service.save")}
        </Button>
      </div>
    </>
  );
};

export default EditBranchImage;
