const connectDB = require("./db/connect");
const dotenv = require("dotenv");
const Student = require("./models/Student");
dotenv.config();

const start = async () => {
  await connectDB(process.env.MONGODB_URI);

  await Student.find({}).deleteMany({});
};

start();
