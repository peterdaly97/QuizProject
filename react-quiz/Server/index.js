const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'adminpasswd',
    database : 'quiztestdb'

});

connection.connect(err => {
    if(err) {
        return err;
    }
});

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM Users', (err, results) => {
        if(err) {
            res.send(err);
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

app.listen(4000, () => {
    console.log('listening on port 4000');
});