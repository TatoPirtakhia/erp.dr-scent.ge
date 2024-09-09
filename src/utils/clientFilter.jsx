import { Button, Popover, Select } from "antd";
import { useState } from 'react';
import {
    FilterOutlined
} from "@ant-design/icons";
import locale from 'antd/es/date-picker/locale/ka_GE';
import 'dayjs/locale/ka';
import { getTranslation } from "../lang/translationUtils";
const ClientFilter = (props) => {
    const [open, setOpen] = useState(false);
    const {
        setFilterData,
        statesOptions,
        companyTypeOptions,
        filterData
    } = props;

    const handleFilterOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    const Clear = () => {
        setFilterData(prev => ({ ...prev, state_id: null, company_type_id: null }))
    }
    const content = (
        <div className="flex flex-col gap-4">
            <div className="w-100 flex justify-end mt-[-35px]" onClick={() => Clear()}>
                <span className="cursor-pointer hover:text-[#3E79F7] mt-1" >{getTranslation('sidenav.products.filter.clear')}</span>
            </div>

            <Select
                className="min-w-[200px]"
                style={{ maxWidth: 400 }}
                allowClear
                placeholder={getTranslation('sidenav.client.state')}
                options={statesOptions}
                value={filterData.state_id}
                onChange={(value) => {
                    setFilterData(prev => ({ ...prev, state_id: value }))
                }}
            />

            <Select
                className="min-w-[200px]"
                style={{ maxWidth: 400 }}
                placeholder={getTranslation('sidenav.client.company_type')}
                allowClear
                options={companyTypeOptions}
                value={filterData.company_type_id}
                onChange={(value) => {
                    setFilterData(prev => ({ ...prev, company_type_id: value }))
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

export default ClientFilter;
