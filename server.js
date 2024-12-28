const app = require('./app');

const port = 8880;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
