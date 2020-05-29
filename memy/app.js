"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memeList = require("./memeList.js");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const list = memeList.exampleMemes;
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    const mostExpensive = list.getBestMemes();
    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: mostExpensive });
});
app.get('/meme/:memeId', (req, res) => {
    try {
        const meme = list.getMeme(parseInt(req.params.memeId, 10));
        const prices = meme.getPrices();
        res.render('meme', { prices: { prices } });
    }
    catch (error) {
        res.status(500);
        res.render('error', { error: { error } });
    }
});
app.use(express.urlencoded({
    extended: true
}));
app.post('/meme/:memeId', (req, res) => {
    const meme = list.getMeme(parseInt(req.params.memeId, 10));
    const price = req.body.price;
    meme.setPrice(parseInt(price, 10));
    res.render('meme', { prices: meme.getPrices() });
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
// error handler
const errorHandler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
};
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
