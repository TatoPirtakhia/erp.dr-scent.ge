import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import Flex from '../components/shared-components/Flex';
import { ExcelIcon } from '../assets/svg/icon';
import { getTranslation } from '../lang/translationUtils';
const ExportExcel = ({ excelData, fileName }) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8';
    const fileExtension = '.xlsx';
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(excelData);

        const colWidths = Object.keys(ws).reduce((acc, key) => {
            const colIndex = XLSX.utils.decode_cell(key).c;
            const cell = ws[key];
            if (cell && cell.v) {
                const cellValue = cell.v.toString();
                acc[colIndex] = Math.max(acc[colIndex] || 0, cellValue.length * 1.3);
            }
            return acc;
        }, []);

        ws['!cols'] = colWidths.map(width => ({ width }));

        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };



    return (
        <>
            <Button icon={<DownloadOutlined  style={{ fontSize: 19 }} />} onClick={exportToExcel}>
                {getTranslation("excel_export_button")}
            </Button>
        </>
    );
};

export default ExportExcel;
