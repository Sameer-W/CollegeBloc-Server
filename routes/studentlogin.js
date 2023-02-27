const express = require('express');
const Student = require('../models/Student');
const router = express.Router();
const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var generator = require('generate-password');
// var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'collegeBloc';


// ROUTE 1 : Create a User using : POST "/api/auth/createuser". Doesn't require Auth

router.post('/create', [
    body('name', 'Enter a valid name').isLength({
        min: 3
    }),
    body('email', 'Enter a valid username').isEmail(),
    body('username', 'Enter a valid username').isAlphanumeric(),
    body('rollno','Enter a valid rollno').isNumeric()
    
], async (req, res) => {
    //If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    // Check whether the user with this username exists already
    try {
        let user = await Student.findOne({
            username: req.body.username
        });
        if (user) {
            return res.status(400).json({
                errors: "Sorry a user with this username already exists"
            });
        }
        // const salt = await bcrypt.genSalt(10);
        // const secPass= await bcrypt.hash(req.body.password,salt);

        var password = generator.generate({length:8,numbers:true});
        
        //Create a new user
        user = await Student.create({
            name: req.body.name,
            email: req.body.email,
            password: password,
            username: req.body.username,
            rollno: req.body.rollno
        });
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET);

        res.json({authtoken});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error Occured');

    }
})

// ROUTE 2 : Authenticate a user using: POST "/api/auth/login"
router.post('/login', [
    body('username', 'Enter a valid username').exists(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
     //If there are errors, return Bad request and the errors
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array()});
    }
    
    const { username, password } = req.body;
    try{
        let user = await Student.findOne({ username });
        if (!user) {
                    return res.status(400).json({ errors: "Please try to login with correct credentials." });
        }
        
        const passwordCompare = (password==user.password);
        if(!passwordCompare){
            return res.status(400).json({ errors: "Please try to login with correct credentials." });
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET);
        res.json({authtoken});


    } catch(err){
        console.error(err.message);
        res.status(500).send('Internal Server Error Occured');

    }
})


// ROUTE 3 : Get logged in user details using : POST "/api/auth/getuser". Login required 
// router.post('/getuser', fetchuser, async (req, res) => {
    
//     try{
//             let userId = req.user.id;
//             const user = await User.findById(userId).select("-password");
//             res.send(user);
//         } catch (err){
//             console.error(err.message);
//             res.status(500).send('Internal Server Error Occured');
//     }
    
// })            
    
module.exports = router;