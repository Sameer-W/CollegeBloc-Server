const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();
const app=express();
const port=5000;
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

//Available routes
app.use('/api/auth/',require('./routes/auth'))
app.use('/api/student',require('./routes/studentlogin'))
// app.use('/api/results',require('./routes/results'))
app.use("/api/password-reset", require('./routes/passwordReset'));


app.get('/',(req,res)=>{
    res.send('Hello Swanand');
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});