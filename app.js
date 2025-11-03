require("dotenv").config();
const express = require("express");
const app = express();
const { StatusCodes } = require("http-status-codes");
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "FINANCE API WORKING",
  });
});
app.listen(port, () => {
  console.log(`Application is up and running on port ${port}`);
});
