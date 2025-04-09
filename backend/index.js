require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const User = require("./models/User");
require("./config/passport"); // Passport Configuration


const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true  // Allow sending cookies
}));


mongoose.connect("mongodb+srv://231001184:saranraj7s@cluster0.a5cja.mongodb.net/oauth_users")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Express Session

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://231001184:saranraj7s@cluster0.a5cja.mongodb.net/oauth_users" }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day session
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get("/home",(req,res)=>{
    res.send("Hi this is Saran");
});
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {  // Passport checks if user is logged in
      return next();
  }
  res.status(401).json({ message: "Please log in first" });
}


// Routes
app.use("/auth", require("./routes/auth"));

app.get("/dashboard", isAuthenticated, (req, res) => {
  console.log("User data in /dashboard:", req.user);  // Debugging
  res.json(req.user);
});
const isAdmin = require('./middleware/isAdmin');

app.get("/admin", isAdmin, (req, res) => {
  res.json({ message: "Welcome, Admin!", user: req.user });
});

const auctionRoutes = require("./routes/auction");



app.use("/api/auction", auctionRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));