import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, App } from 'antd';
import * as XLSX from 'xlsx';
import { getTranslation } from '../lang/translationUtils';

const ExcelImport = ({setImportedData}) => {
    const { message } = App.useApp();
    const props = {
        accept: '.xls,.xlsx',
        showUploadList: false, 
        beforeUpload: (file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                setImportedData(jsonData.map((row) => ({
                    id: row.ID,
                    name: row.Name,
                    SKU: row.SKU,
                    quantity: row.Quantity,
                    price: row.Price
                })).filter(elm => elm.quantity));
            };
            reader.onerror = (e) => {
                console.error("Error reading file:", e.target.error);
                message.error(`Error reading file: ${file.name}`);
            };
            reader.readAsArrayBuffer(file);

            return false;
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <Upload {...props}  >
            <Button icon={<UploadOutlined style={{ fontSize: 19 }} />}>{getTranslation("excel_import_button")}</Button>
        </Upload>
    );
};

export default ExcelImport;
