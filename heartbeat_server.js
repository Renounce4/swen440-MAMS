'use strict';

// Modules 
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var spawn = require('child_process').spawn;



// Configuration

// Server port
var port = process.env.PORT || 8080; 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 


var didWeGetABeat = false;

app.get('/heartbeat', function(req, res){
    console.log('lub-dub');
    didWeGetABeat = true;
});

var check_in_server_process = spawn('node', ['check_in_server.js']);

function checkForHeartbeat(){
    setTimeout(function(){
        if(!didWeGetABeat){
            console.log('Oh no! We didn\'t get a heartbeat!');
            //Restart the check in server by killing the old process and starting a new one
            check_in_server_process.kill('SIGINT');
            check_in_server_process = spawn('node', ['check_in_server.js']);
        } else {
            console.log('We got a beat, good.');
            didWeGetABeat = false;
            checkForHeartbeat();
        }
    }, 5000);
}



checkForHeartbeat();

app.get('*', function(req, res){
    res.send('Twee hee hee');
});

// Start App 
app.listen(port);               

console.log('Server running on ' + port);
