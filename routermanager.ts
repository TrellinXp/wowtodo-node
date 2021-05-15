import express = require('express');

export class RouterManager {
    createWeeklyRouter(con, app) {
        const weeklyRouter = express.Router();
        var route = weeklyRouter.route('/weekly');
        route.get((req, res) => {
            con.query('SELECT * FROM Mplus', function (err, results, fields) {
                if (err) throw err;

                var resultArray = [];
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
                        return;
                    }

                    if (res.affectedRows == 0) {
                        return;
                    }

                    console.log("Weekly Reset Mplus");
                }
            )

            con.query(
                "UPDATE Raid SET completed = ?",
                [0],
                (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        return;
                    }

                    console.log("Weekly Reset Raid");
                }
            )
        });

        app.post('/api/weekly', function (req, res) {
            if (req.body !== undefined) {
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
            }
        });

        app.post('/api/raid', function (req, res) {
            if (req.body !== undefined) {
                var data = req.body;
                if (!req.body) {
                    res.status(400).send({
                        message: "Content can not be empty!"
                    });
                }
                con.query(
                    "UPDATE Raid SET counter = ?, completed = ? WHERE id = ?",
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

                        console.log("updated raid: ", data);
                    }
                )
            }
        });
        app.use('/api', weeklyRouter);
    }

    createRaidRouter(con, app) {
        const raidRouter = express.Router();
        raidRouter.route('/raid')
            .get((req, res) => {
                con.query('SELECT * FROM Raid WHERE difficulty = ?',
                ['NHC'], function (err, results, fields) {
                    if (err) throw err;
                    res.json(results);
                })
            });
        app.use('/api', raidRouter);
    }
}
