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
  const { data, onClose } = props;
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
      // ! IF image already exists we want to change it
      if (imageIds.length > 0) {
        // Handle modal close on cancel click
        return handleImageRemoval();
      }
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
              notification.success({
                message: getTranslation("Successfully added an image"),
                description: getTranslation(response.payload.message),
              });
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
      dispatch(deleteBranchImage({ imageIds, user_id: data.user_id }))
        .then((response) => {
          notification.success({
            message: "Image deleted Successfully",
          });
          setDeletedImageId(response.meta.arg.imageIds);
        })
        .catch((response) => {
          console.log("Something went wrong with deleting img");
        });
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
      <Flex gap={10} justify="flex-end">
        <Button onClick={onClose} type="">
          გაუქმება
        </Button>
        <Button type="primary" loading={loading} onClick={handleSubmit}>
          ჩამახსოვრება
        </Button>
      </Flex>
    </>
  );
};

export default EditBranchImage;
