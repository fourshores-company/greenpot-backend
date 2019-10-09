/* eslint-disable linebreak-style */
import dotenv from 'dotenv';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import db from '../models';

dotenv.config();

const { User } = db;
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK
} = process.env;

passport.use(new OAuth2Strategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK,
  profileFields: ['name', 'photos', 'email']
},
async (accessToken, refreshToken, profile, done) => {
  const {
    name: {
      familyName: lastName,
      givenName: firstName,
    }, emails: [{ value: email }]
  } = profile;
  // Check if the user exits or not
  // Create the user if it doesnt exit
  const [user, created] = await User.findOrCreate({
    where: { googleId: profile.id },
    defaults: {
      firstName,
      lastName,
      isVerified: true,
      email,
    }
  });
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
