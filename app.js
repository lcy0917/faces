var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jadeMiddleware = require('./server/utils/jadeMiddleware')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(jadeMiddleware)

/////////////////////// TODO refactor
var database = require('./server/database/Database.js');
database.connect('faces');

var routes = require('./server/routes/index');
app.use('/', routes);

var facesRoutes = require('./server/routes/faces');
var statsRoutes = require('./server/routes/stats')

app.get('/faces/all', facesRoutes.all);
app.get('/faces/random', facesRoutes.random);
app.post('/faces/check', facesRoutes.check);
app.post('/faces/find', facesRoutes.find);
app.get('/faces/popular', statsRoutes.getMostRecognizable);
///////////////////////


module.exports = app;
