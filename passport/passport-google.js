'use strict';

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretfile');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: secret.google.callbackURL,
    passReqToCallback: secret.google.passReqToCallback
}, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({ google: profile.id }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, user);
        } else {
            const username = profile.displayName.toLowerCase().replace(' ', '');
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = username;
            newUser.email = profile.emails[0].value;
            // newUser.userImage = profile._json.image.url;
            newUser.userImage = 'defaultPic.png';

            newUser.save((err) => {
                if (err) {
                    return done(err)
                }
                return done(null, newUser);
            })
        }
    })
}));