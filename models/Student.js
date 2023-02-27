const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true

    },
    rollno:{
        type:Number,
        required:true
    }
    
});

const Student = mongoose.model('student', UserSchema);

module.exports = Student;