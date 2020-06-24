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
  req['db'] = new sqlite3.Database('quiz.db');
  req['db'].configure("busyTimeout", 2000000)
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

app.use((req, _res, next) => {
  if(req.session.loggedIn) {
    req['db'].get("SELECT * FROM users WHERE username = ?", [req.session.login], (err, row) => {
      if (Number(row.passversion) !== Number(req.session.passVer)) {
        delete(req.session.login);
        delete(req.session.loggedIn);
        delete(req.session.passVer);
      }
      next()
    });
  } else {
    next();
  }
});

app.get('/', csrfProtection, (req, res) => {
  req['db'].all("SELECT * FROM quizes", (err, rows) => { 
    res.render('quiz', {csrfToken: req.csrfToken(), quizList: rows, isLoggedIn: JSON.stringify(req.session.loggedIn)});
  });
});

app.post('/quizDo', parseForm, csrfProtection, (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/');
  } else {
    req['db'].get("SELECT * FROM quizes WHERE id = ?", [req.body.quizId], (err, row) => {
      if (!row) {
        res.render('message', {title: "Błąd", message: "Nie ma takiego quizu"});
      } else {
        req['db'].get("SELECT * FROM quizEnd WHERE id = ? AND username = ?", [req.body.quizId, req.session.login], (enderr, endrow) => {
          if (!endrow) {
            req['db'].run("BEGIN EXCLUSIVE TRANSACTION;"); // Nie chcemy, żeby były dwa czasy rozpoczęcia
            req['db'].get("SELECT * FROM quizStart WHERE id = ? AND username = ?", [req.body.quizId, req.session.login], (beginerr, beginrow) => {
              if (!beginrow) { // Quiz jest rozpoczynany
                const currTime = new Date();
                req['db'].run("INSERT INTO quizStart VALUES(?,?,?)", [req.body.quizId, req.session.login, currTime]);
                req['db'].run("COMMIT TRANSACTION;");
              } else { // Quiz już rozpoczęto, ale jeszcze nie rozwiązano
                req['db'].run("ROLLBACK");
              }
              res.render('quizSolve', {csrfToken: req.csrfToken(), quizIntro: row.intro, quizQuestions: row.questions, quizId: req.body.quizId});
            })
          } else {
            res.render('message', {title: "Błąd", message: "Użytkownik już rozwiązał quiz"});
          }
        });
      }
    });
  }
});

app.post('/quizSolved', parseForm, csrfProtection, (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/');
  } else {
    req['db'].get("SELECT * FROM quizes WHERE id = ?", [req.body.quizId], (err, row) => {
      if (!row) {
        res.render('message', {title: "Błąd", message: "Nie ma takiego quizu"});
      } else {
        req['db'].run("BEGIN EXCLUSIVE TRANSACTION;"); // W ten sposób użytkownik nie może jednocześnie wysłać rozwiązań w dwóch kartach
        req['db'].get("SELECT * FROM quizEnd WHERE id = ? AND username = ?", [req.body.quizId, req.session.login], (enderr, endrow) => {
          if (!endrow) { // Jeszcze nie był rozwiązywany
            req['db'].get("SELECT * FROM quizStart WHERE id = ? AND username = ?", [req.body.quizId, req.session.login], (beginerr, beginrow) => {
              if (!beginrow) { // Użytkownik jest oszustem
                req['db'].run("ROLLBACK");
                res.render('message', {title: "Błąd", message: "Nie można rozwiązać quizu jeśli jeszcze się go nie rozpoczęło"});
              } else {
                const currTime = new Date();
                req['db'].run("INSERT INTO quizEnd VALUES(?,?,?)", [req.body.quizId, req.session.login, currTime]);
                req['db'].run("COMMIT TRANSACTION;");
                let totalResult = Math.floor((currTime.getTime() - beginrow.starttime)/1000);
                const corrAns = [];
                const wrongAns = [];
                const stats = JSON.parse(req.body.finalTimes).map((n) => {return 100*n}).map(Math.round).map(String);
                const quiz = JSON.parse(row.questions);
                const numOfQuestions = quiz.length;
                let sentTimeSum = 0;
                for (let i = 0; i < numOfQuestions; i++) {
                  if (Number((JSON.parse(req.body.finalAnswers))[i]) === Number(quiz[i].answer)) {
                      corrAns.push(i+1);
                  } else {
                      wrongAns.push(i+1);
                      totalResult += quiz[i].penalty;
                  }
                }
                req['db'].run("INSERT INTO quizStats VALUES(?,?,?,?,?,?)", [req.body.quizId, req.session.login, JSON.stringify(corrAns), JSON.stringify(wrongAns), totalResult, req.body.finalTimes]);
                res.render('quizEnd', {result: totalResult, stats: stats});
              }
            })
          } else {  // Już był rozwiązywany
            req['db'].run("ROLLBACK");
            res.render('message', {title: "Błąd", message: "Nie można rozwiązać quizu dwa razy"});
          }
        });
      }
    });
  }
});

app.get('/statsChoose', csrfProtection, (req, res) => {
  if(!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    req['db'].all("SELECT * FROM quizStats WHERE username = ?", [req.session.login], (err, rows) => {
      if (rows.length === 0) {
        res.render('message', {title: "Tu nic nie ma", message: "Nie rozwiązano jeszcze żadnego quizu"});
      } else {
        res.render('statsChoose', {csrfToken: req.csrfToken(), quizList: rows});
      }
    });
  }
});

app.post('/stats', csrfProtection, (req, res) => {
  if(!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    req['db'].get("SELECT * FROM quizStats WHERE username = ? AND id = ?", [req.session.login, req.body.quizId], (err, row) => {
      if (!row) {
        res.render('message', {title: "Błąd", message: "Nie można oglądać statystyk quizu, którego się nie rozwiązało"});
      } else {
        req['db'].all("SELECT * FROM quizStats WHERE id = ? ORDER BY result ASC", [req.body.quizId], (err, rows) => {
          const topStats = rows.slice(0, 5);
          const corrAns = JSON.parse(row.corrans);
          const wrongAns = JSON.parse(row.wrongans);
          req['db'].get("SELECT * FROM quizes WHERE id = ?", [req.body.quizId], (err, quiz) => {
            const numOfQuestions = JSON.parse(quiz.questions).length;
            const averages = [numOfQuestions];
            const realAns = [numOfQuestions];
            for (let i = 0; i < numOfQuestions; i++) {
              averages[i] = 0;
              realAns[i] = JSON.parse(quiz.questions)[i].answer;
            }
            for (let i = 0; i < rows.length; i++) {
              for (let j = 0; j < numOfQuestions; j++) {
                averages[j] += Number(JSON.parse(rows[i].times)[j]);
              }
            }
            for (let i = 0; i < numOfQuestions; i++) {
              averages[i] /= rows.length;
              averages[i] *= 100;
            }
            res.render('stats', {csrfToken: req.csrfToken(), topStats: topStats, corrAns: corrAns, wrongAns: wrongAns, averages: averages, realAns: realAns});
          }
          )}
        )}
    });
  }
});

// Logowanie
app.get('/login', csrfProtection, async (req, res) => {
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
        res.render('message', {title: "Błąd", message: "Podano błędną nazwę użytkownika lub błędne hasło"});
      } else {
        const hash = crypto.pbkdf2Sync(req.body.pass, row.salt, 1000, 64, 'sha512').toString('hex');
        if (hash === row.passhash) {
          req.session.login = req.body.user;
          req.session.loggedIn = true;
          req.session.passVer = row.passversion;
          res.redirect('/');
        } else {
          res.render('message', {title: "Błąd", message: "Podano błędną nazwę użytkownika lub błędne hasło"});
        }
      }
    });
  }
});

app.get('/logout', csrfProtection, (req, res) => {
  delete(req.session.login);
  delete(req.session.loggedIn);
  delete(req.session.passVer);
  res.redirect('/');
});

app.get('/changePass', csrfProtection, (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/');
  } else {
    res.render('changePass', {csrfToken: req.csrfToken()});
  }
});

app.post('/changePassDo', parseForm, csrfProtection, (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/');
  } else {
    req['db'].run("BEGIN EXCLUSIVE TRANSACTION;");
    req['db'].get("SELECT * FROM users WHERE username = ?", [req.session.login], (err, row) => {
      if (row === undefined) {
        req['db'].run("ROLLBACK;");
        res.render('message', {title: "Błąd", message: "Coś poszło nie tak"});
      } else {
        const hash = crypto.pbkdf2Sync(req.body.pass, row.salt, 1000, 64, 'sha512').toString('hex');
        if (hash === row.passhash) {
          const newHash = crypto.pbkdf2Sync(req.body.newPass, row.salt, 1000, 64, 'sha512').toString('hex');
          const login = req.session.login
          const passVer = row.passversion;
         
          req['db'].run("UPDATE users SET passhash = ?, passversion = ? WHERE username = ?", [newHash, passVer+1, req.session.login])
                   .run("COMMIT TRANSACTION;")                   
          res.redirect('/');
        } else {
          req['db'].run("ROLLBACK;");
          res.render('message', {title: "Błąd", message: "Podano błędne hasło"});
        }
      }
    });
  }
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
