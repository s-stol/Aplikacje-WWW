import sqlite3 = require('sqlite3');

let db = new sqlite3.Database('quiz.db');
db.serialize(() => {
    db.run("DROP TABLE IF EXISTS users");
    db.run("DROP TABLE IF EXISTS quizes");
    db.run("DROP TABLE IF EXISTS quizStart");
    db.run("DROP TABLE IF EXISTS quizEnd");
    db.run("DROP TABLE IF EXISTS quizStats");
    
    db.run("CREATE TABLE users(username TEXT NOT NULL PRIMARY KEY, passhash TEXT, salt TEXT, passversion INTEGER);")
    
    db.run("INSERT INTO users VALUES('user1', '0c6817906f11c629e570838b282aeb0e1db7cf371f0981ffba7e5532a71a4fafeb89c19533fe163d7bde2e6f088fbfbd945a8dba66cd58e9a71483427956e34d', '752064a9a31147eb1aef7d48446c6966', 1);")
    db.run("INSERT INTO users VALUES('user2', 'e16f779682d4ff0ed9a76df3c7d6f156e69ff5ec83a24dec012f777c28af9287d7cbfcbf2ab2f8f383495c32a91fbe4aaf1917470f8669ea28d1638fa1fd703f', 'd38dd880ab9e5f30833995e7028d6398', 1);")
    db.run("INSERT INTO users VALUES('test', '7c66944c13b5928b64b1478513362286722eb3a418259d692f44e75d99255dc01e077e3628d7e72feaf8243e2f1d807df73f05b3a03d4c52d052d35a0e6c0a01', 'd804b027a88544ae4cf7bca4532a6508', 1);")
    
    db.run("CREATE TABLE quizes(id INTEGER NOT NULL PRIMARY KEY, intro TEXT, questions TEXT);")
    
    db.run(`INSERT INTO quizes VALUES(1, 'Oto przykładowy quiz','[{"question":"2 + 2 =","answer":4, "penalty":3},{"question":"(4 + 17) x (11 - 4) =","answer":147, "penalty":5},{"question":"(2 x 3 + 14) x (54 - 13) =","answer":820, "penalty":10},{"question":"(13 x 3 + 7) x (4 + 2) =","answer":276, "penalty":10}]');`)
    db.run(`INSERT INTO quizes VALUES(2, 'Oto inny przykładowy quiz','[{"question":"3 + 5 =","answer":8, "penalty":4},{"question":"11 x 13 =","answer":143, "penalty":5},{"question":"(7 + 5) x 4 =","answer":48, "penalty":6},{"question":"17 x (2 + 2) =","answer":68, "penalty":6},{"question":"12 x (43 + 1) =","answer":528, "penalty":8}]');`)
    
    db.run("CREATE TABLE quizStart(id INTEGER, username TEXT, starttime TIMESTAMP);")
    db.run("CREATE TABLE quizEnd(id INTEGER, username TEXT, endtime TIMESTAMP);")
    
    db.run("CREATE TABLE quizStats(id INTEGER, username TEXT, corrans TEXT, wrongans TEXT, result INTEGER, times TEXT);")
})

db.close()