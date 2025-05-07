// const express = require('express');
// const app = express();
// const userModel = require("./models/user");
// const postModel = require("./models/post");
// const cookieParser = require('cookie-parser');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');


// app.set("view engine", "ejs");
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(cookieParser());

// app.get('/', (req, res) => {
//     res.render('index');
// });

// app.get('/login', (req, res) => {
//     res.render('login');
// });

// app.post('/register', async (req,res) => {
//     let {username, email, password, name, age} = req.body;

//     let user = await userModel.findOne({email});
//     if(user) return res.status(500).send({message: "User already exists"});
    
//     bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(password, salt, async (err, hash) => {
//             let user = await userModel.create({
//                 username,
//                 email,
//                 password: hash,
//                 name,
//                 age
//             });

//             let token = jwt.sign({email: email, userid: use._id}, "shhhh");
//             res.cookie("token", token);
//             res,send("registred")
//         })
//     });
// });

// app.post('/login', async (req,res) => {
//     let {email, password} = req.body;

//     let user = await userModel.findOne({email});
//     if(!user) return res.status(500).send({message: "Something went wrong"});
    
//     bcrypt.compare(password, user.password, function (err, result){
//         if(result) res.status(200).send("You can login");
//         else res.redirect("/login");
//     })
// });

// app.listen(3000);

const express = require('express');
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/register', async (req, res) => {
    let { username, email, password, name, age } = req.body;

    let existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).send({ message: "User already exists" });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.status(500).send("Error hashing password");

            let newUser = await userModel.create({
                username,
                email,
                password: hash,
                name,
                age
            });

            let token = jwt.sign({ email: email, userid: newUser._id }, "shhhh");

            res.cookie("token", token);

            res.send("Registered successfully");
        });
    });
});

// Login route
app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).send({ message: "Invalid credentials" });

    bcrypt.compare(password, user.password, function (err, result) {
        if (err) return res.status(500).send("Error checking password");

        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
            res.cookie("token", token);
            res.status(200).send("Login successful");
        } else {
            res.redirect("/login");
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
