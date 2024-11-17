const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/connect");
const User = require("backend/UserSchema");
const LocalStrategy = require("passport-local").Strategy;

const app = express();

connectDB();

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//used to serve static files to client from backend
app.use(express.static(path.join(__dirname, "..", "frontend","public")));


//used for parsing form-data
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect("/homepage");
    }
    else
    res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
})

app.get("/signIn",(req,res)=>{
    res.sendFile(path.join(__dirname, "..", "frontend", "public", "sign.html"));
})

app.get("/signUp",(req,res)=>{
    res.sendFile(path.join(__dirname, "..", "frontend", "public", "signup.html"));
})

app.get("/homepage",(req,res)=>{
    try {
        if(req.isAuthenticated()){
            res.sendFile(path.join(__dirname, "..","frontend", "index1.html"));
        }
        else{
            res.redirect("/");
        }
    } catch (error) {
        console.log(error.message);
        res.redirect("/");
    }
})

app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        return next(err);
        
        res.redirect("/");
    });
})

passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, // use email as the username
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email}); 
          if (!user) return done(null, false, { message: 'Incorrect email' });
  
          const result = await bcrypt.compare(password, user.password); 
          if (!result) return done(null, false, { message: 'Incorrect password' });
  
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      })
    )


passport.serializeUser((user, done) => {
    done(null, user.id);
});
    
passport.deserializeUser(async (id, done) => {
try {
    const user = await User.findById(id); 
    done(null, user);
} catch (err) {
    done(err);
}
});
      

app.post('/signIn', 
  passport.authenticate('local', { failureRedirect: '/signIn' }),
  function(req, res) {
    res.redirect('/homepage');
});


app.post("/signUp",async(req,res)=>{
    const {name,email,mobile,age,password} = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.redirect("/signUp");
        }

        // Create a new user record in the database
        const newUser = await User.create({
            name,
            email,
            mobile,
            age,
            password,
        });

        // Log in the user after successful signup
        req.login(newUser, (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }

            // Redirect to the homepage after successful login
            res.redirect("/homepage");
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
})

app.listen(3000,(req,res)=>{
    console.log("Server Running on port 3000");
})