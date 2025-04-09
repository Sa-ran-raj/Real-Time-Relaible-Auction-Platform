const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google Auth Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback Route
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard"); // Redirect after successful login
  }
); 



// Logout Route
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy();  // Destroy session
    res.redirect("http://localhost:5173/");  // Redirect to homepage
  });
});


module.exports = router;
