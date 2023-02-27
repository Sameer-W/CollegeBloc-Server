require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();

//rest of the packages
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//database
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/auth", authRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, console.log(`Server running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
