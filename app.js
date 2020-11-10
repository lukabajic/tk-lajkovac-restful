const express = require("express");

// where to run server
const port = process.env.PORT || 8000;
const ROOT_URL = `http://localhost:${port}`;

const app = express();

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`> Ready on ${ROOT_URL}`);
});
