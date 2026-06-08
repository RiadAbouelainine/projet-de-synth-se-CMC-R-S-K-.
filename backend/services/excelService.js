const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelService {
    constructor() {
        this.workbook = new ExcelJS.Workbook();
        this.filePath = process.env.EXCEL_PATH
            || path.join(process.env.USERPROFILE || process.env.HOME || '', 'Desktop', 'inventaire tribologie.xlsx');
    }

    getColumnIndex(headers, key, maxCol) {
        for (let i = 1; i <= maxCol; i++) {
            if (headers[i] === key) return i;
        }
        return -1;
    }

    async getHeaders(sheet) {
        let maxCol = 1;
        sheet.eachRow((row) => {
            if (row.cellCount > maxCol) maxCol = row.cellCount;
        });

        const headers = [];
        const extractValue = (val) => {
            if (val && typeof val === 'object') {
                if (val.richText) return val.richText.map(rt => rt.text).join(' ');
                if (val.formula) return val.result !== undefined ? val.result : '';
                if (val.hyperlink) return val.text;
                if (val.error) return val.error;
                if (val instanceof Date) return val.toLocaleDateString();
                return val.result !== undefined ? val.result : JSON.stringify(val);
            }
            return val;
        };

        const headerRow = sheet.getRow(1);
        for (let i = 1; i <= maxCol; i++) {
            const cell = headerRow.getCell(i);
            const parsedVal = extractValue(cell.value);
            let hName = parsedVal ? parsedVal.toString().trim() : `Colonne ${i}`;
            if (headers.includes(hName)) hName = `${hName} (${i})`;
            headers[i] = hName;
        }
        return { headers, maxCol, extractValue };
    }

    async init() {
        if (fs.existsSync(this.filePath)) {
            await this.workbook.xlsx.readFile(this.filePath);
        } else {
            throw new Error(`Excel file not found at ${this.filePath}`);
        }
    }

    async getSheetData(sheetName) {
        const sheet = this.workbook.getWorksheet(sheetName);
        if (!sheet) throw new Error(`Sheet ${sheetName} not found`);

        const data = [];
        const { headers, maxCol, extractValue } = await this.getHeaders(sheet);

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const rowData = { id: rowNumber };
                let hasData = false;
                for (let i = 1; i <= maxCol; i++) {
                    const cell = row.getCell(i);
                    const val = extractValue(cell.value);
                    if (val !== null && val !== undefined && val !== '') hasData = true;
                    rowData[headers[i]] = val;
                }
                if (hasData) data.push(rowData);
            }
        });

        return { headers: headers.filter(Boolean), rows: data };
    }

    async updateRow(sheetName, rowIndex, updateData) {
        const sheet = this.workbook.getWorksheet(sheetName);
        if (!sheet) throw new Error(`Sheet ${sheetName} not found`);

        const { headers, maxCol } = await this.getHeaders(sheet);
        const row = sheet.getRow(rowIndex);

        Object.keys(updateData).forEach(key => {
            if (key === 'id') return;
            const colIndex = this.getColumnIndex(headers, key, maxCol);
            if (colIndex !== -1) {
                row.getCell(colIndex).value = updateData[key];
            }
        });

        row.commit();
        await this.workbook.xlsx.writeFile(this.filePath);
        return true;
    }

    async addRow(sheetName, addData) {
        const sheet = this.workbook.getWorksheet(sheetName);
        if (!sheet) throw new Error(`Sheet ${sheetName} not found`);

        const { headers, maxCol } = await this.getHeaders(sheet);

        const newRowValues = [];
        for (let i = 1; i <= maxCol; i++) {
            const header = headers[i];
            newRowValues[i - 1] = (header && addData[header] !== undefined) ? addData[header] : null;
        }

        const newRow = sheet.addRow(newRowValues);
        newRow.commit();
        await this.workbook.xlsx.writeFile(this.filePath);
        return { id: newRow.number };
    }

    async deleteRow(sheetName, rowIndex) {
        const sheet = this.workbook.getWorksheet(sheetName);
        if (!sheet) throw new Error(`Sheet ${sheetName} not found`);
        sheet.spliceRows(rowIndex, 1);
        await this.workbook.xlsx.writeFile(this.filePath);
        return true;
    }
}

module.exports = new ExcelService();
