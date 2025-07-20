const app = require('./app');
const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  console.log(`My Server http://localhost:${PORT}`);
});