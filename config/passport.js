const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { loggers } = require('winston');
const logger = loggers.get('general-logger');
const bcrypt = require('bcryptjs');
const configFb = require("./index").facebookApi;
const userModel = require('../models/User');

const setPassportStrategies = (passport) =>{
    passport.use( new LocalStrategy({ usernameField: 'email'}, (email, password, done)=>{
        // Match User
        userModel.findOne({email: email})
                .then(user =>{
                    if(!user){
                        return done(null, false, {message: 'That email is not registered'});
                    }

                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch)=>{
                        if(err) throw err;

                        if(isMatch){
                            return done(null, user)
                        }
                        else{
                            return done(null, false, {message: 'Password is incorrect'})
                        }
                    })
                })
                .catch(err => done(err))
        })
    )

    const facebookOptions ={
        clientID: configFb.FACEBOOK_APP_ID ,
        clientSecret: configFb.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:5000/users/loginFacebook/callback',
        profileFields: ['emails', 'name']
    }

    passport.use( new FacebookStrategy(facebookOptions , (accessToken, refreshToken, profile, done)=>{
        const email = profile.emails[0].value;
        const middleName = profile.name.middleName ? profile.name.middleName +' ' : '';
        const name = profile.name.givenName +" "+middleName + profile.name.familyName;

        userModel.findOne({email: email})
            .then(user =>{
                if(!user){
                    const newUser = new userModel({
                        name,
                        FBname: name,
                        FBtoken: accessToken,
                        email,
                        locallyRegistered: false,
                        password: accessToken
                    });
                    //hash Password, first generate a salt of factor 10 and then hash the password with that salt
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt , (err, hash) =>{
                        if(err) throw err;

                        newUser.password = hash;
                        logger.info("new FB user created: "+newUser.name);
                        newUser.save()
                            .then(user => {
                                return done(null, user)
                            })
                            .catch(err => done(err))

                    }))
                }
                else{
                    //if the user was register locally i update the missing data in the db
                    if(user.locallyRegistered && !user.FBname){
                        user.FBname = name;
                        user.FBtoken = accessToken;
                        user.save()
                            .then(user =>{
                                return done(null, user)
                            })
                            .catch(err => done(err))
                    }
                    else{
                        done(null, user);
                    }
                }
            })
            .catch(err => done(err))
    }));

    //used on request, brings the cookie info of the user from redis
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

module.exports = setPassportStrategies;


