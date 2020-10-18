const express = require("express");
const app = express();
const bodyParses = require('body-parser');
const config = require('./config');

app.use(bodyParses.json());

app.use(express.static('public'));

const corsMiddleware = require('./middlewares/cors');
app.options('*', corsMiddleware);
app.use(corsMiddleware);

//no console logs in production as they are not needed and they create overhead to the server
if (process.env.NODE_ENV === 'production') {
    console.log = function () { };
}

//import winston and combine with morgan
const logger = require("./middlewares/logger").useWinstonCombinedWithMorgan(app);
logger.verbose("logger winston and morgan configured");

//initialize and connect to mongodb
require("./databases/mongoDb");

//EJS
const expressLayout = require("express-ejs-layouts");
app.use(expressLayout);
app.set('view engine', 'ejs');

// Bodyparser middleware
app.use(express.urlencoded({extended: false}));

// configure session middleware
const session = require('./middlewares/session');
app.use(session);

// passport middleware
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
//configure passport strategies
require('./config/passport')(passport);

//connect flash middleware
//The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared
// after being displayed to the user. The flash is typically used in combination with redirects.
const flash = require('connect-flash');
app.use(flash())

//custom middleware that have some global variables to be accessed everywhere by ejs or the other methods
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    //here is where passport when given the parameter failureFlash: true will save the error using flash session
    res.locals.error = req.flash('error');
    next();
})

//routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/game')
app.use('/',indexRoutes);
app.use('/game', gameRoutes);
app.use('/users',userRoutes);

const PORT = config.server.port;

app.listen(PORT, logger.info(`Server started on port ${PORT}`));