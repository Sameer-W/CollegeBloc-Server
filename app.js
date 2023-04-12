require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();

//rest of the packages
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//database
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const recruiterRouter = require("./routes/recruiterRoutes");
const collegeRouter = require("./routes/collegeRoutes");
const studentRouter = require("./routes/studentRoutes");
const interViewInviteRouter = require("./routes/interviewInviteRoutes");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const corsOptions = require("./config/corsOptions");

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser(process.env.JWT_SECRET));
//app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/recruiter", recruiterRouter);
app.use("/api/v1/college", collegeRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/interviewInvites", interViewInviteRouter);

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
