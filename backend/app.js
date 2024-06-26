var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const session = require('express-session');
require('dotenv').config();
const USER = require("./models/user")

var apiRouter = require('./routes/api');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : process.env.PASSPORT_SECRET, resave : false, saveUninitialized : true}))
app.use(passport.session());

main().catch((err)=> console.log(err));

async function main(){
  await mongoose.connect(process.env.MONGO_CONNECTION_LINK);
}

app.use('/api', apiRouter);

passport.use(new LocalStrategy(async (users, pass, done)=>{
  try{
    const user = await USER.findOne({username : users});
    if(!user){
      return done(null, false, {message : "Username is incorrect"});
    }
    const match = await bcrypt.compare(pass, user.password);
    if(!match){
      return done(null, false, {message : "Password is incorrect"})
    }
    return done(null, user);
  }
  catch(err){
    return done(err)
  }
}))

passport.serializeUser((user,done)=>{
  done(null, user.id);
})

passport.deserializeUser(async (id, done)=>{
  try{
    const user = await USER.findById(id);
    return done(null, user);
  }
  catch(err){
    done(err);
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
