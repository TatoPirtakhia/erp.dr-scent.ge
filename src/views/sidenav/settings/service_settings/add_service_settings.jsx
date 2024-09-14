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
  const [range1, setRange1] = useState(1);
  const [range2, setRange2] = useState(1);
  const [day, setDay] = useState(1);
  const handleSave = async () => {
    console.log("Test");
  };
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
  return (
    <Modal
      footer={null}
      title="Add Service Settings"
      onCancel={onClose}
      open={true}
    >
      <div className="flex flex-col gap-5">
        <div className="mt-2">
          <h3>Select day</h3>
          <div className="flex items-center gap-3">
            <InputNumber
              min={1}
              max={40}
              defaultValue={range1}
              onChange={(value) => setRange1(value)}
            />
            To
            <InputNumber
              min={1}
              max={40}
              defaultValue={range2}
              onChange={(value) => setRange2(value)}
            />
          </div>
        </div>
        <div>
          <h2 className="text-[#B4BED2]">Choose colors</h2>
          <div className="flex  gap-7">
            <div>
              <p>Progress Bar Color</p>
              <ColorPicker
                showText
                defaultValue="#1a2dd200"
                value={color}
                onChange={handleBarColorChange}
              />
            </div>
            <div>
              <p>Text color</p>
              <ColorPicker
                showText
                defaultValue="#1a2dd200"
                value={textColor}
                onChange={handleTextColorChange}
              />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-[#B4BED2]">Enter day</h2>
          <InputNumber
            defaultValue={1}
            min={1}
            max={30}
            onChange={(value) => setDay(value)}
          />
        </div>
          <Progress
            percent={(100 / 30) * day}
            strokeColor={color}
            showInfo
            format={() => <span className='text-[#000] font-bold font-noto_georgian mr-1 p-0' >{day} {getTranslation("day")}</span> }
            percentPosition={{
              align: 'end',
              type: 'inner',
            }}
            size={[, 22]}
          />
        <div className="flex flex-1 justify-end gap-3">
          <Button onClick={() => onClose()}>
            {getTranslation("sidenav.product.Cancel")}
          </Button>
          <Button onClick={handleSave} type="primary" htmlType="submit">
            {getTranslation("sidenav.product.Add")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default AddServiceSettings;
