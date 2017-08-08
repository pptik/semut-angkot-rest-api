const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

let index = require('./routes/index');
let users = require('./routes/users');

const app = express();
const mongoConnect = require('./database/mongo_connection');
async function connect() {
    try{
        let database = await mongoConnect.connect();
    }catch (err){
        console.log(err);
    }
}
connect();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


app.use((req, res) => {
  res.send(200).send({success: false, message: "Forbidden route"});
});


app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.send(200).send({success: false, message: "Forbidden route"});
});

module.exports = app;
