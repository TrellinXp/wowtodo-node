import express = require('express');

export class RouterManager {

    createWeeklyRouter(con, app) {

        app.route('/api/weekly')
        .get((req, res) => {
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
        })
        .post((req, res) => {
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
                            return;
                        }

                        if (res.affectedRows == 0) {
                            return;
                        }

                        console.log("updated mplus: ", data);
                        return;
                    }
                )

                res.status(200).send({
                    message: "Updated Data"
                });
            }
        })
    }

    createResetRouter(con, app) {
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

            res.status(200).send({
                message: "Weekly Reset Sucessfull"
            });
        });
    }

    createRaidRouter(con, app) {
        app.get('/api/raid', function (req, res) {
            con.query('SELECT * FROM Raid WHERE difficulty = ?',
                ['NHC'], function (err, results, fields) {
                    if (err) throw err;
                    res.json(results);
                })
        });

        app.get('/api/raidHC', function (req, res) {
            con.query('SELECT * FROM Raid WHERE difficulty = ?',
                ['HC'], function (err, results, fields) {
                    if (err) throw err;
                    res.json(results);
                })
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

                res.status(200).send({
                    message: "Updated Raid "+req.body  
                });
            }
        });
    }
}
