export class DatabaseManager {
    createConnection() {
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
}