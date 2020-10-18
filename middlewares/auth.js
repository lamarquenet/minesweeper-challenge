//guarding url, add this middleware to any route that needs to be protected
const ensureAuth = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/users/login');
}

const ifAuthRedirectToDash = (req, res, next) =>{
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    }
    else{
        return next();
    }
}

module.exports = {
    ifAuthRedirectToDash,
    ensureAuth
}