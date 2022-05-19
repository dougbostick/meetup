const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");

//app.use("/dist", express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

const port = 3002 || process.env.PORT;

app.listen(port, console.log(`listening on port ${port}`));
