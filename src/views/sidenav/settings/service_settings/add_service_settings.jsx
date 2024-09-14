// საბა ჯიაძე 9/12
import { Form, Input, Button, Modal, Progress } from "antd";
import { getTranslation } from "../../../../lang/translationUtils";
import { InputNumber } from "antd";
import React, { useState } from "react";
import { ColorPicker, Space } from "antd";
const AddServiceSettings = (props) => {
  const { onClose, onColorChange, onTextColorChange } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#1677ff");
  const [textColor, setTextColor] = useState("#1a2dd0");
  const [startRange, setStartRange] = useState(1);
  const [endRange, setEndRange] = useState(10);
  const [isInRange, setIsInRange] = useState(false);
  const [day, setDay] = useState(1);
  const handleSave = async () => {};
  const handleBarColorChange = (color) => {
    const colorHex = color.toHexString();
    setColor(colorHex);
    onColorChange && onColorChange(colorHex);
  };
  const handleTextColorChange = (color) => {
    const colorHex = color.toHexString();
    setTextColor(colorHex);
    onTextColorChange && onTextColorChange(colorHex);
  };
  const checkRange = (value) => {
    if (value > startRange && value < endRange) {
      setIsInRange(true);
    } else {
      setIsInRange(false);
    }
  };
  const handleDayChange = (value) => {
    setDay(value);
    checkRange(value);
  };
  return (
    <Modal
      footer={null}
      title="Add Service Settings"
      onCancel={onClose}
      open={true}
    >
      <Form
        layout="vertical"
        name="Add service Settings"
        onFinish={handleSave}
        form={form}
      >
        <Form.Item
          label="Range"
          rules={[{ required: true, message: "Range is required" }]}
        >
          <div className="flex items-center gap-3">
            <InputNumber
              min={1}
              max={40}
              defaultValue={startRange}
              onChange={(value) => setStartRange(value)}
            />
            To
            <InputNumber
              min={1}
              max={30}
              defaultValue={endRange}
              onChange={(value) => setEndRange(value)}
            />
          </div>
        </Form.Item>
        <div className="flex md:items-center md:gap-5 justify-start flex-col md:flex-row ">
          <Form.Item label="Progress Bar Color">
            <ColorPicker
              showText
              defaultValue="#1a2dd200"
              value={color}
              onChange={handleBarColorChange}
            />
          </Form.Item>
          <Form.Item label="Text Color">
            <ColorPicker
              showText
              defaultValue="#1a2dd200"
              value={textColor}
              onChange={handleTextColorChange}
            />
          </Form.Item>
          <Form.Item label="Enter Day">
            <InputNumber
              defaultValue={1}
              min={1}
              max={30}
              onChange={handleDayChange}
            />
          </Form.Item>
        </div>
        <Progress
          percent={(100 / 30) * day}
          strokeColor={isInRange ? color : "#d9d9d9"}
          showInfo
          format={() => (
            <span
              style={{ color: isInRange ? textColor : "#000" }}
              className=" font-bold font-noto_georgian mr-1 p-0"
            >
              {day} {getTranslation("day")}
            </span>
          )}
          percentPosition={{
            align: "end",
            type: "inner",
          }}
          size={[, 22]}
        />
        <div className="flex flex-1 mt-3 justify-end gap-3">
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
export default AddServiceSettings;
