import express = require('express');
import cors = require('cors');
import { DatabaseManager } from "./databasemanager";
import { RouterManager } from "./routermanager";
import { Express } from 'express-serve-static-core';
const app = express();
app.set( "view engine", "ejs" );
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

intializeApp(app);

function intializeApp(app: Express) {
    app.use(cors());
    const port = process.env.PORT || 4000;

    let database: DatabaseManager = new DatabaseManager();
    let router: RouterManager = new RouterManager();
    const con = database.createConnection();
    // parse various different custom JSON types as JSON
    
    router.createWeeklyRouter(con, app);
    router.createRaidRouter(con, app);
    router.createResetRouter(con, app);
    app.get('/', (req, res) => {
        res.send('Welcome to my Nodemon API!');
    });
    
    app.listen(port, () => {
        console.log(`Running on port ${port}/`)
    });
}