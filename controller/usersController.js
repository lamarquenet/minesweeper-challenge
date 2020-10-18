const bcrypt = require('bcryptjs');
const passport = require('passport');
const { loggers } = require('winston');
const logger = loggers.get('general-logger');
const {registerValidation, loginValidation } = require('../lib/validations');
const userModel = require("../models/User")

//Get handlers with middleware
const loginFacebook = (req, res, next)=>{
    passport.authenticate('facebook',{
        scope:['email']
    })(req, res, next);
}
//what to do after facebook make a call back to us telling if it was or not succesfull the login using facebook
const loginFacebookCb = (req, res, next) =>{
    passport.authenticate('facebook', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}

const loginLocal = (req, res, next) =>{
    const {email, password} = req.body;
    const {error} = loginValidation.validate(req.body);
    let errors = []
    if(error){
        errors.push({msg: error.details[0].message});
        logger.verbose("user input incorrect data while registering: "+ errors[0].msg);
    }

    if(errors.length > 0){
        res.render('login', {
            errors,
            email,
            password,
        })
    }
    else{
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    }
}

const logout = (req, res) =>{
    // passport understand this logout and do the work of logging out for us
    req.logout();
    req.flash('succes_msg', 'You are logged out');
    res.redirect('/users/login');
}

//Post handlers:
// Register Handle
const register = (req, res) =>{
    const {name , email, password, password2} = req.body;
    //validation using joi schemas
    const {error} = registerValidation.validate(req.body);

    let errors = []
    if(error){
        errors.push({msg: error.details[0].message});
        logger.verbose("user input incorrect data while registering: "+ errors[0].msg);
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        //validation passed
        userModel.findOne({email})
            .then(user =>{
                if(user && user.locallyRegistered){
                    //user exists
                    errors.push({msg: 'Email is already registered'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }
                else if(user){
                    //in this case the user was registered using an external account and now is trying to register using mail
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt , (err, hash) =>{
                        if(err) throw err;
                        user.locallyRegistered = true;
                        user.password = hash;
                        console.log("A facebook user updated his password: "+user.name);
                        userModel.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now register and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                    }))
                }
                else{
                    const newUser = new userModel({
                        name,
                        email,
                        locallyRegistered: true,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt , (err, hash) =>{
                        if(err) throw err;

                        newUser.password = hash;
                        console.log("new mail user registered: "+newUser.name);

                        newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now register and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                    }))
                }
            });
    }
}

module.exports = {
    loginFacebook,
    loginFacebookCb,
    loginLocal,
    logout,
    register
}