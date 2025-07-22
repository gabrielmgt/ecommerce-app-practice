require('dotenv').config();
const app = require('./app');
const PORT = 7001;

app.listen(PORT, () => {
  console.log(`Backend Server http://localhost:${PORT}`);
});