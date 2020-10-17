const express = require("express");
const app = express();
const bodyParses = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose')

app.use(bodyParses.json());

if (process.env.NODE_ENV === 'production') {
    console.log = function () { };
}

//import winston and combine with morgan
const logger = require("./middlewares/logger").useWinstonCombinedWithMorgan(app);

//connect to mongodb
mongoose.connect(config.getDbConnectionStringAtlas(),
    {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
    .then(() => console.log('mongoDB connected...'))
    .catch(err => console.log(err));

//EJS
const expressLayout = require("express-ejs-layouts");
app.use(expressLayout);
app.set('view engine', 'ejs');

// Bodyparser middleware
app.use(express.urlencoded({extended: false}));


//connect flash middleware
const flash = require('connect-flash');
app.use(flash())

//custom middleware that have some global variables to be accessed by ejs
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
app.use('/',indexRoutes);
app.use('/users',userRoutes);

app.use(express.static('public'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, logger.info(`Server started on port ${PORT}`));