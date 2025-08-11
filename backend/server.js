const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const appName = process.env.APP_NAME || "My App";

// API example
app.get('/api', (req, res) => {
    res.json({ message: `Hello from ${appName}` });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(`${appName} is listening on port ${port}`);
});
