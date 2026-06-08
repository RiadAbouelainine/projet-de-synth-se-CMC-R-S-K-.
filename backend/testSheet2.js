const excelService = require('./services/excelService');
async function run() {
    await excelService.init();
    const sheets = ['Tribologie', 'Production Increase', 'A TRANSIT', 'Stagiaires', 'Moyenne généraux', 'Prix', 'EMPLOYES PAR BUREAU'];
    
    for (const sheet of sheets) {
        try {
            const data = await excelService.getSheetData(sheet);
            const duplicates = data.headers.filter((item, index) => data.headers.indexOf(item) !== index);
            console.log(`[${sheet}]: Rows=${data.rows.length}, Headers=${data.headers.length}. Duplicates: ${duplicates.length > 0 ? duplicates.join(', ') : 'None'}`);
        } catch(e) {
            console.error(`Error on ${sheet}:`, e.message);
        }
    }
}
run();
