const excelService = require('./services/excelService');
async function run() {
    await excelService.init();
    try {
        const data = await excelService.getSheetData('Tribologie');
        console.log("Row 2 data:", JSON.stringify(data.rows[0], null, 2));
    } catch(e) {
        console.error("Error:", e.message);
    }
}
run();
