import createError = require('http-errors');
import express = require('express');
import path = require('path');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import csrf = require('csurf')
import logger = require('morgan');
import session = require('express-session');
import sqlite3 = require('sqlite3');
const SQLiteStore = require('connect-sqlite3')(session);
import crypto = require('crypto');
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });

import util = require("util");

const app = express();

app.use((req, _res, next) => {
  req['db'] = new sqlite3.Database('meme.db');
  req['db'].configure("busyTimeout", 2000000);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({
  extended: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('4r4th3rtr1ckys3cr3t'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({store: new SQLiteStore, secret: '4r4th3rtr1ckys3cr3t', saveUninitialized: true, resave: true}));
app.use(csrf({ cookie: true }));

app.get('/', csrfProtection, (req, res) => {
  const sql = `SELECT * FROM memes ORDER BY price DESC LIMIT 3`;
  req['db'].all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    const memes = [];
    rows.forEach(element => {
      memes.push({id: element.id, price: JSON.parse(element.prices)[0].price, url: element.url, name: element.name});
    });
    let loginAction: String;
    let loginText: String
    if (req.session.loggedIn) {
      loginAction = '/logout';
      loginText = 'Wyloguj';
    } else {
      loginAction = '/login';
      loginText = 'Zaloguj';
    }
    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: memes.slice(0, 3), loginAction: loginAction, loginText: loginText });
  })
});

app.get('/meme/:memeId', csrfProtection, (req, res) => {
  const sql = 'SELECT prices FROM memes WHERE id = ?';
  req['db'].get(sql, [req.params.memeId.toString()], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row === undefined) {
      res.render('noMeme', {id: req.params.memeId});
    } else {
      const priceList = JSON.parse(row.prices) as {price: Number, name: String}[];
      const prices = [];
      priceList.forEach(element => {
        prices.push(element.price);
      });
      res.render('meme', { prices: prices, csrfToken: req.csrfToken(), id: req.params.memeId }, );
    }
  })
});

app.post('/process/:memeId', parseForm, csrfProtection, (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    if (isNaN(Number(req.params.memeId))) {
      res.redirect('/wrongParam');
    } else {
      req['db'].run("BEGIN EXCLUSIVE TRANSACTION;");
      req['db'].get("SELECT prices FROM memes WHERE id = ?;", [req.params.memeId], (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        if (row === undefined) {
          req['db'].run("ROLLBACK;");
          res.render('noUser', {id: req.params.memeId});
        } else {
          const newPrices = JSON.parse(row.prices) as {price: Number, user: String}[];
          const price = parseInt(req.body.price, 10);
          newPrices.unshift({price: price, user: req.session.login});
          req['db'].run("UPDATE memes SET prices = ?, price = ? WHERE id = ?", [JSON.stringify(newPrices), price, req.params.memeId])
                   .run("COMMIT TRANSACTION;");
        }
      })
      res.render('done')
    }
  }
});

// Logowanie
app.get('/login', csrfProtection, (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    res.render('login', {csrfToken: req.csrfToken()});
  }
});

app.post('/loginDo', parseForm, csrfProtection, (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    req['db'].get("SELECT * FROM users WHERE username = ?", [req.body.user], (err, row) => {
      if (row === undefined) {
        res.render('noUser');
      } else {
        const hash = crypto.pbkdf2Sync(req.body.pass, row.salt, 1000, 64, 'sha512').toString('hex');
        console.log(hash);
        if (hash === row.passhash) {
          req.session.login = req.body.user;
          req.session.loggedIn = true;
          res.redirect('/');
        } else {
          res.render('noUser');
        }
      }
    });
  }
});

app.get('/logout', csrfProtection, (req, res, next) => {
  delete(req.session.login);
  delete(req.session.loggedIn);
  res.redirect('/');
});

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
