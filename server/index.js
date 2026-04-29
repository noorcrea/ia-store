const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', app: 'ia-store' });
});

// Main app route
app.get('/', (req, res) => {
    res.json({ 
                 message: 'ia store - AI Page Builder Shopify App',
          version: '1.0.0',
          status: 'running'
    });
});

// Serve static client files if they exist
app.use(express.static(path.join(__dirname, '../client')));

app.listen(PORT, () => {
    console.log(`ia-store server running on port ${PORT}`);
});
