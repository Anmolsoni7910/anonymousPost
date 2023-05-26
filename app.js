// require('dotenv').config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose = require("mongoose");
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require('passport-local-mongoose');


// const app = express();

// mongoose.set('strictQuery', false);

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// //This is called Middleware which will be called for every requests to server
// app.use(session({
//   secret: 'Our little secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {}
// }));

// //using passport package to initialize and uses session package
// app.use(passport.initialize());
// app.use(passport.session());

// //*******Startiong the DB Connection *********************** */
// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/userDB');//here we need to give the db name (eg : userDB)
//   console.log("DB connected successfully");
// }
// main().catch(err => console.log(err));
// //*******The DB connection is established ******************* */

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String
//   },
//   password: {
//     type: String
//   }
// });

// // DbSchema uses the plugin for passport-local-mongoose package
// userSchema.plugin(passportLocalMongoose);

// const User = new mongoose.model("User", userSchema);

// //Here db-model used to create strtegy and serialize and deserialize 
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.get("/", (req, res) => {
//   res.render("home");
// });

// app.get('/login', (req, res) => {
//   res.render("login");
// });

// app.get('/register', (req, res) => {
//   res.render("register");
// });

// app.get('/secrets', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.render("secrets");
//   } else {
//     res.redirect('/login');
//   }
// });

// app.post('/register', (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   User.register({ username: username }, password).then(() => {
//     const authenticate = passport.authenticate("local");
//     authenticate(req, res, () => {
//       res.redirect('/secrets');
//     });
//   }).catch(err => {
//     console.log(err);
//     res.redirect("/register");
//   });
// });

// app.post("/login", (req, res) => {
//   const newUser = new User({
//     username: req.body.username,
//     password: req.body.password
//   })
//   //login fuunction is given by passport (same as register function is also provided by passport)
//   req.login(newUser, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       passport.authenticate("local")(req, res, function () {
//         res.redirect('/secrets');
//       })
//     }
//   })
// });

// app.get('/submit', (req, res) => {
//   res.render("submit");
// });

// app.get('/logout', (req, res) => {
//   req.logout(function (err) {
//     if (err) { return next(err); }
//     res.redirect('/');
//   });
// });

// app.listen(3000, () => {
//   console.log("Server started at port 3000");
// });


require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//const md5 = require("md5"); --------- stage 3 md5 hash
// const bcrypt = require("bcrypt");   --------- stage 4 bcrypt hash
// const saltRounds = 10;
//const encrypt = require("mongoose-encryption");   ------- stage 1 and 2

mongoose.set('strictQuery', false);

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//#################################  session code goes here
//This is called Middleware which will be called for every requests to server
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));
//#################################

//using passport package to initialize and uses session package
app.use(passport.initialize());
app.use(passport.session());


//*******Startiong the DB Connection *********************** */
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
    console.log("DB connected successfully");
}

main().catch(err => console.log(err));


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

// userSchema.plugin(encrypt,{
//     secret : process.env.SECRET,          -------------- used in mongoose-encryption stage 1,2
//     encryptedFields : ["password"]
// });

const User = mongoose.model("User", userSchema);

//Here db-model used to create strtegy and serialize and deserialize 
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render("home");
});

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect('/login');
    }
});

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        /*
        ----------- stage 1,2,3 -----------
        const userName = req.body.username;
        const passWord = req.body.password;
    
        User.findOne({email : userName})
        .then((foundUser) => {
            bcrypt.compare(passWord,foundUser.password)
            .then((result) => {
                if(result === true){
                    res.render("secrets");
                }else{
                    console.log("Wrong Password");
                    res.redirect("/");
                }
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
        });
        */
        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        })
        //login fuunction is given by passport (same as register function is also provided by passport)
        req.login(newUser, (err) => {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect('/secrets');
                })
            }
        });
    });

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        /*
        ----------- stage 1,2,3 -----------
        bcrypt.hash(req.body.password,saltRounds)
        .then((hash) => {
            const newUser = new User({
                email : req.body.username,
                password : hash
            });
        
            newUser.save();
        
            res.render("secrets");
        })
        .catch((err) => {
            console.log(err);
        });
        */
        const username = req.body.username;
        const password = req.body.password;
        User.register({ username: username }, password).then(() => {
            const authenticate = passport.authenticate("local");
            authenticate(req, res, () => {
                res.redirect('/secrets');
            });
        }).catch(err => {
            console.log(err);
            res.redirect("/register");
        });
    });

app.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get("/submit", (req, res) => {
    res.render("submit");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server is running successfully!!!!");
});

