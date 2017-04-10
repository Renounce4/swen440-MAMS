'use strict'; 
// Modules 
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var http = require('http');
var path = require('path');



// Configuration

// Server port
var port = process.env.PORT || 8090; 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

function beatHeart() {
    setTimeout(function(){
        console.log('Gonna beat your heart');
        http.get('http://localhost:8080/heartbeat')
        .on('error', function(error){
            console.log('Yikes we got an error');
        });
        beatHeart();
    }, 1000);
}
beatHeart();

app.post('/check-in', function(req, res){
    console.log('Got a check-in request');
    if(req.body.id < 0) {
        process.exit(1);
    }
    console.log('Student ID #', req.body.id);
    res.sendFile(path.join(__dirname, 'check_in_site.html'));
});

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'check_in_site.html'));
});


// Start App 
app.listen(port);               

console.log('Server running on ' + port);
