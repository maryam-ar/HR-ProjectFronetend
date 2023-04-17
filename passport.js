const GoogleStrategy = require("passport-google-oauth20").Strategy;

const passport = require("passport");
require("dotenv").config();

const USER = require("./models/users");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async function(accessToken, refreshToken, profile, done) {
  try {
    const existingUser = await USER.findOne({ email: profile.emails[0].value });
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = new USER({
      
      userName: profile.displayName,
      email: profile.emails[0].value,
      source:"Google",
      random1:"maryam",
      totalProjects:"1000",
      totalEmployees:"5000",
      budgets:"20000",
      totalOrders:"65" 

    });
    await newUser.save();
    

    

    return done(null, newUser);

    

  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
