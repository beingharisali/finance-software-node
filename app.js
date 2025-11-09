require("dotenv").config();
const express = require("express");
const app = express();
const { StatusCodes } = require("http-status-codes");
const cors = require("cors");
const connectDB = require("./db/connect");
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/auth");
const saleRoutes = require("./routes/saleRoutes");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/sales", saleRoutes);

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "FINANCE API WORKING",
  });
});

app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Application is up and listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
