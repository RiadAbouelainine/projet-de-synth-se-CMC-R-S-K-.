const excelService = require('./services/excelService');
async function run() {
    await excelService.init();
    try {
        console.log("Testing Tribologie...");
        const data = await excelService.getSheetData('Tribologie');
        console.log("Tribologie rows:", data.rows.length, "Headers:", data.headers);
    } catch(e) {
        console.error("Error on Tribologie:", e.message);
    }
    
    try {
        console.log("\nTesting Moyenne généraux...");
        const data2 = await excelService.getSheetData('Moyenne généraux');
        console.log("Moyenne generaux rows:", data2.rows.length, "Headers:", data2.headers);
    } catch(e) {
        console.error("Error on Moyenne generaux:", e.message);
    }
}
run();
