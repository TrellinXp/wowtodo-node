const express = require('express');
var cors = require('cors');
//var bodyParser = require('body-parser')
const app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

intializeApp(app);

function intializeApp(app) {
    app.use(cors());
    const port = process.env.PORT || 4000;
    var con = createConnection();
    // parse various different custom JSON types as JSON
    //app.use(bodyParser.json({ type: 'application/*+json' }))
    createWeeklyRouter(con, app);
    createRaidRouter(con, app);
    app.get('/', (req, res) => {
        res.send('Welcome to my Nodemon API!');
    });
    
    app.listen(port, () => {
        console.log(`Running on port ${port}/`)
    });
}

function createConnection() {
    const mysql = require('mysql');
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

    return con;
}

function createWeeklyRouter(con, app) {
    const weeklyRouter = express.Router();
    var route = weeklyRouter.route('/weekly');
    route.get((req, res) => {
            con.query('SELECT * FROM Mplus', function (err, results, fields) {
                if (err) throw err;

                var resultArray = [''];
                results.forEach(element => {                    
                    const key = {
                        Id: element.Id,
                        Counter: element.Counter,
                        Completed: element.Completed
                    };
                    resultArray.push(key);
                });

                res.json(results);
            })
    });

    app.post('/api/reset', function (req, res) {
        con.query(
            "UPDATE Mplus SET completed = ?",
            [0],
            (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(false, err);
                return;
              }
        
              if (res.affectedRows == 0) {
                result(true, null);
                return;
              }
        
              console.log("Weekly Reset");
            }
        )
    });

    app.post('/api/weekly', function (req, res) {
        if(req.body !== undefined) {
            var data = req.body;
            if (!req.body) {
                res.status(400).send({
                    message: "Content can not be empty!"
                });
            }
            con.query(
                "UPDATE Mplus SET counter = ?, completed = ? WHERE id = ?",
                [data.Counter, data.Completed, data.Id],
                (err, res) => {
                  if (err) {
                    console.log("error: ", err);
                    //result(null, err);
                    return;
                  }
            
                  if (res.affectedRows == 0) {
                    // not found Customer with the id
                    //result({ kind: "not_found" }, null);
                    return;
                  }
            
                  console.log("updated mplus: ", data);
                }
              )
    }});
    app.use('/api', weeklyRouter);
}

function createRaidRouter(con, app) {
    const raidRouter = express.Router();
    raidRouter.route('/raid')
        .get((req, res) => {
            con.query('SELECT * FROM Raid', function (err, results, fields) {
                if (err) throw err;
                res.json(results);
            })
        });
    app.use('/api', raidRouter);
}

