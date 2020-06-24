import sqlite3 = require('sqlite3');

let db = new sqlite3.Database('quiz.db');
db.serialize(() => {
    db.run("DELETE FROM quizStart WHERE username = ?", ["test"])
    db.run("DELETE FROM quizEnd WHERE username = ?", ["test"])
    db.run("DELETE FROM quizStats WHERE username = ?", ["test"])
})

db.close()