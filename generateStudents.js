const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const Student = require("./models/student");
const dotenv = require("dotenv");

dotenv.config();

const start = async () => {
  await connectDB(process.env.MONGODB_URI);

  const years = ["FY", "SY", "TY", "LY"];
  const branches = ["COMPS", "EXTC", "IT", "MECH", "ETRX"];
  const divisions = ["A", "B", "C"];

  const generateRollNumbers = () => {
    const rolls = [];

    for (let i = 0; i < 131; i++) {
      const roll = (1911001 + i).toString();
      rolls.push(roll);
    }

    return rolls;
  };

  const rolls = generateRollNumbers();

  for (let i = 0; i < 131; i++) {
    const student = new Student({
      name: `Student ${i + 1}`,
      email: `student${i + 1}@example.com`,
      password: "password",
      roll_no: rolls[i],
      year: years[Math.floor(Math.random() * years.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      division: divisions[Math.floor(Math.random() * divisions.length)],
      role: "student",
    });

    student
      .save()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

start();
