'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secretfile');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: secret.facebook.profileFields,
    callbackURL: secret.facebook.callbackURL,
    passReqToCallback: secret.facebook.passReqToCallback
}, (req, token, refreshToken, profile, done) => {

    User.findOne({ facebook: profile.id }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, user);
        } else {
            const username = profile.displayName.toLowerCase().replace(' ', '');
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = username;
            newUser.email = profile._json.email;
            // newUser.userImage = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            newUser.userImage = 'defaultPic.png';
            newUser.fbTokens.push({ token: token });

            newUser.save((err) => {
                return done(null, newUser);
            })
        }
    })
}));