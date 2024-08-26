import { Button, Popover, Select } from "antd";
import { useState } from 'react';
import {
    FilterOutlined
} from "@ant-design/icons";
import locale from 'antd/es/date-picker/locale/ka_GE';
import 'dayjs/locale/ka';
import { getTranslation } from "../lang/translationUtils";
const ProductFilter = (props) => {
    const [open, setOpen] = useState(false);
    const {
        setFilterData,
        categoryOptions,
        unitOptions,
        filterData
    } = props;

    const handleFilterOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    const Clear = () => {
        setFilterData(prev => ({ ...prev, category_id: null, unit_id: null }))
    }
    const content = (
        <div className="flex flex-col gap-4">
            <div className="w-100 flex justify-end mt-[-35px]" onClick={() => Clear()}>
                <span className="cursor-pointer hover:text-[#3E79F7] mt-1" >{getTranslation('sidenav.products.filter.clear')}</span>
            </div>

            <Select
                className="w-100"
                style={{ minWidth: 180 }}
                allowClear
                placeholder={getTranslation('sidenav.products.category')}
                options={categoryOptions}
                value={filterData.category_id}
                onChange={(value) => {
                    setFilterData(prev => ({ ...prev, category_id: value }))
                }}
            />

            <Select
                className="min-w-[200px]"
                style={{ maxWidth: 400 }}
                placeholder={getTranslation('sidenav.settings.Unit')}
                allowClear
                options={unitOptions}
                value={filterData.unit_id}
                onChange={(value) => {
                    setFilterData(prev => ({ ...prev, unit_id: value }))
                }}
            />
        </div>
    );

    return (
        <Popover
            content={content}
            title={getTranslation('sidenav.products.filter.title')}
            trigger="click"
            placement="bottomRight"
            open={open} // Use "visible" instead of "open"
            onOpenChange={handleFilterOpenChange} // Use "onVisibleChange" instead of "onOpenChange"
        >
            <Button
                block
                icon={<FilterOutlined style={{ cursor: 'pointer', fontSize: '22px' }} />} />
        </Popover>
    );
};

export default ProductFilter;
