const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLEAUTH_CLIENTID,
      clientSecret: process.env.GOOGLEAUTH_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, callback) => {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
