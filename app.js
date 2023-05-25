require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(encrypt,{
    secret : process.env.SECRET,
    encryptedFields : ["password"]
});

const User = mongoose.model("User",userSchema);

app.get("/",(req,res) => {
    res.render("home");
});

app.route("/login")
.get((req,res) => {
    res.render("login");
})
.post((req,res) => {
    const userName = req.body.username;
    const passWord = req.body.password;

    User.findOne({email : userName})
    .then((foundUser) => {
        if(foundUser.password === passWord){
            res.render("secrets");
        }else{
            console.log("Password Incorrect!!!");
            res.redirect("/");
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

app.route("/register")
.get((req,res) => {
    res.render("register");
})
.post((req,res) => {
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save();

    res.render("secrets");
});

app.get("/submit",(req,res) => {
    res.render("submit");
});

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}

app.listen(port, () => {
    console.log("Server is running successfully!!!!");
});
