const app = require('./app');
const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  console.log(`Backend Server http://localhost:${PORT}`);
});