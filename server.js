const express = require('express');
const mysql = require('mysql');
var cors = require('cors');

const app = express();
const weeklyRouter = express.Router();
app.use(cors());

const hostname = '127.0.0.1'
const port = process.env.PORT || 4000;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "weekly",
    password: "CCnCut3na452dK2",
    port: '3307'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

weeklyRouter.route('/weekly')
    .get((req, res) => {
        con.query('SELECT * FROM Mplus', function (err, results, fields) {
            if (err) throw err;
            res.json(results);
        })
    });

app.use('/api', weeklyRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my Nodemon API!');
});

app.listen(port, () => {
    console.log(`Running on port ${port}/`)
});

function queryDatabase(conn) {
    conn.query('SELECT * FROM Mplus', function (err, results, fields) {
        if (err) throw err;
        console.log('SELECTED * FROM Mplus.');
    })
    conn.end(function (err) {
        if (err) throw err;
        else console.log('Done.')
    });
};