require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello Word!");
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
