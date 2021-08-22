'use strict';

const express = require("express");
const expbs = require('express-handlebars');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '/static')));
app.use(express.json());        
app.use(express.urlencoded({ extended: true }));

const hbs = expbs.create({
  extname:'hbs',
    defaultLayout:'layout',
    layoutsDir: path.join(__dirname, '/views/layouts/'),
    partialsDir: path.join(__dirname, '/views/partials/')
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));



const practice = require("./routes/practice");

app.get('/', (req, res) => res.sendFile(path.join(__dirname, "/index.html")));
app.use("/practice", practice);

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
    // res.render('error');
  });

module.exports = app;