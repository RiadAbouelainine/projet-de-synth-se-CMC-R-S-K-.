require('dotenv').config();
const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventory');
const excelService = require('./services/excelService');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/inventory', inventoryRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await excelService.init();
        console.log("Excel configured successfully.");
    } catch (err) {
        console.error("Failed to initialize Excel:", err.message);
    }
});
