const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const database = require('./database/mongo_connection');
const debug = require('debug')('semut-svc:server');
const http = require('http');
let app = express();

/** setup express **/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** get mongodb connection pool* */
database.connect().then(db =>{
    /** if error **/
    app.use((err, req, res) => {
        res.status(200).send({success: false, message: "server not responding, cause "+err});
    });
    /** init server **/
    let port = normalizePort(process.env.PORT || '3030');
    app.set('port', port);
    let server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    function normalizePort(val) {
        let port = parseInt(val, 10);
        if (isNaN(port)) return val;
        if (port >= 0) return port;
        return false;
    }
    function onError(error) {
        if (error.syscall !== 'listen') throw error;
        let bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    function onListening() {
        let addr = server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
    /** export mongodb connection **/
    app.db = db;
    module.exports = app;

    /** define routes**/
    let index = require('./routes/index');
    let users = require('./routes/users');
    app.use('/', index);
    app.use('/users', users);

    /** if route not found**/
    app.use((req, res) => {
        res.status(200).send({success: false, message: "service not found"});
    });
}).catch(err=>{
    console.log(err);
});