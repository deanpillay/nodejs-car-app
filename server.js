var http = require('http'),
    express = require('express'),
    app = express(),
    sqlite3 = require('sqlite3').verbose(),
    bodyParser = require('body-parser'),
    db = new sqlite3.Database('azura');

// Add configure directive to tell express to use Jade to render templates
app.set('views', __dirname + '/public');
app.engine('.html', require('jade').__express);

// Allows express to get data from POST requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Database initialization
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='cars'", function(err, row) {
    if(err !== null) {
        console.log(err);
    }
    else if(row == null) {
        db.run('CREATE TABLE "cars" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "make" VARCHAR(255), "model" VARCHAR(255), "km" VARCHAR(255), "color" VARCHAR(255), "location" VARCHAR(255), "value" VARCHAR(255))', function(err) {
            if(err !== null) {
                console.log(err);
            }
            else {
                console.log("SQL Table 'Cars' initialized.");
            }
        });
    }
    else {
        console.log("SQL Table 'Cars' already initialized.");
    }
});

// Render the templates with the data
app.get('/', function(req, res) {

    db.all('SELECT * FROM cars ORDER BY id', function(err, row) {
        if(err !== null) {
            res.status(500).send("An error has occurred -- " + err);
        }
        else {
            res.render('index.jade', {cars: row}, function(err, html) {
                res.status(200).send(html);
            });
        }
    });
});

// New route that will handle additions
app.post('/add', function(req, res) {
    make = req.body.make;
    model = req.body.model;
    km = req.body.km;
    color = req.body.color;
    location = req.body.location;
    value = req.body.value;
    sqlRequest = "INSERT INTO 'cars' (make, model, km, color, location, value) VALUES('" + make + "', '" + model + "', '" + km + "', '" + color + "', '" + location + "', '" + value + "')"
    db.run(sqlRequest, function(err) {
        if(err !== null) {
            res.status(500).send("An error has occurred -- " + err);
        }
        else {
            res.redirect('back');
        }
    });
});


/* This will allow you to run your app smoothly without
 breaking other execution environment */
var port = process.env.PORT || 3000;
var host = process.env.HOST || "127.0.0.1";

// Starts the server itself
var server = http.createServer(app).listen(port, host, function() {
    console.log("Server initialized",
                host, port, app.get('env'));
});