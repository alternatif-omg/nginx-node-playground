const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;
const appName = process.env.APP_NAME || "My App";

// Gunakan folder log yang sama dengan Nginx (shared volume)
const logDirectory = '/var/log/nginx';

// Pastikan folder ada (jika belum, buat)
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Simpan log backend ke file `backend-<APP_NAME>.log`
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, `backend-${appName}.log`),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Endpoint health check (dipanggil oleh docker-compose healthcheck + nginx)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', app: appName });
});

// contoh API (optional)
app.get('/api', (req, res) => {
  res.json({ message: `Hello from ${appName}` });
});

// Jika frontend di-root, static images served oleh nginx.
// Namun tetap sediakan fallback untuk development jika diperlukan:
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// Jika backend juga ingin serve index (dev only), bisa lakukan:
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));

app.listen(port, () => {
  console.log(`${appName} is listening on port ${port}`);
});
