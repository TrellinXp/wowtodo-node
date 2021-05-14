import express = require('express');
import cors = require('cors');
import { DatabaseManager } from "./databasemanager";
import { RouterManager } from "./routermanager";
const app = express();
app.set( "view engine", "ejs" );
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

intializeApp(app);

function intializeApp(app) {
    app.use(cors());
    const port = process.env.PORT || 4000;

    let database: DatabaseManager = new DatabaseManager();
    let router: RouterManager = new RouterManager();
    var con = database.createConnection();
    // parse various different custom JSON types as JSON
    //app.use(bodyParser.json({ type: 'application/*+json' }))
    router.createWeeklyRouter(con, app);
    router.createRaidRouter(con, app);
    app.get('/', (req, res) => {
        res.send('Welcome to my Nodemon API!');
    });
    
    app.listen(port, () => {
        console.log(`Running on port ${port}/`)
    });
}