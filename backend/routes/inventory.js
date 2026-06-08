const express = require('express');
const router = express.Router();
const excelService = require('../services/excelService');

router.get('/:sheetName', async (req, res) => {
    try {
        const { sheetName } = req.params;
        const data = await excelService.getSheetData(sheetName);
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

router.post('/:sheetName', async (req, res) => {
    try {
        const { sheetName } = req.params;
        const result = await excelService.addRow(sheetName, req.body);
        res.json({ message: 'Added successfully', result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:sheetName/:id', async (req, res) => {
    try {
        const { sheetName, id } = req.params;
        await excelService.updateRow(sheetName, parseInt(id, 10), req.body);
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:sheetName/:id', async (req, res) => {
    try {
        const { sheetName, id } = req.params;
        await excelService.deleteRow(sheetName, parseInt(id, 10));
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
