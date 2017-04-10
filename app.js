'use strict';

// Modules
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var spawn = require('child_process').spawn;



// Configuration

// Server port
var port = process.env.PORT || 8000;

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));


function launch() {
    var check_in_server_process = spawn('node', [__dirname + '/Modules/Check_In/check_in_server.js']);
    check_in_server_process.stdout.on('data', (data) => {
        console.log(`Check In Server: ${data}`);
    });
    var heartbeat_server_process = spawn('node', [__dirname + '/Modules/Check_In/heartbeat_server.js']);
    heartbeat_server_process.stdout.on('data', (data) => {
        console.log(`Heartbeat Server: ${data}`);
    });
}
launch();


app.get('*', function(req, res){
    res.send('Check out port 8090. I hear it\'s rad!');
});

// Start App
app.listen(port);

console.log('Server running on ' + port);
