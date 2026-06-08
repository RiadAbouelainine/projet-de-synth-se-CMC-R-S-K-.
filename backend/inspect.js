const ExcelJS = require('exceljs');
const path = require('path');

async function inspect() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(process.env.USERPROFILE, 'Desktop', 'inventaire tribologie.xlsx');
    console.log("Reading file:", filePath);
    try {
        await workbook.xlsx.readFile(filePath);
        workbook.eachSheet((worksheet, id) => {
            console.log(`Sheet ID ${id}: '${worksheet.name}'`);
            const row = worksheet.getRow(1);
            const headers = [];
            row.eachCell((cell, colNumber) => {
                headers.push(cell.value);
            });
            console.log(`   Headers: ${headers.join(', ')}`);
        });
    } catch(err) {
        console.error("Error reading excel:", err.message);
    }
}
inspect().catch(console.error);
