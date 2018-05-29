const express = require('express')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var bodyParser = require('body-parser');

const fs = require('fs');
let path = require('path');

// Init App
const app = express()

// Bring in models
let ToDo = require('./models/toDo');
let db = mongoose.connection;

//check for db errors
db.on('error', console.error.bind(console, 'connection error'));

//check connection
db.once('open', function () {
    //connected
    console.log('Connected to MongoDB')
});

app.use((req, res, next) => {
    //console.log("Logged!")
    next()
})

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + 'index.html'));
    //  console.log("hey: "+toDos.find());
    //  res.send("Hey: "+toDos.);
});

app.get("/api/retrieve", (req, res) => {
    ToDo.find({}, {}, function (err, toDos) {
        if (err) {
            console.log(err);
        } else {
            res.send(toDos);
            console.log("Items retrieved to server file: " + toDos);
        }
    });
});

app.put("/api/delete", (req, res) => {
    var conditions = {
        "toDoText": req.body.toDoText.trim()
    };
    console.log("The miracle 2.0 |"+req.body.toDoText.trim()+"|");
    ToDo.deleteOne(conditions, function (err) {
        if (err) {
            return handleError(err);
            console.log('delete error');
        };
        console.log("Deleted one");
    });
});

app.get("/api/clear", (req, res) => {
    ToDo.deleteMany({}, function (err) {
        if (err) {
            return handleError(err);
            console.log('clear error');
        };
        console.log("Deleted all");
    });
});

app.post("/api/insert", (req, res) => {
    //create document
    console.log("The request check: " + req.body.doneCheck);
    console.log("The request text: " + req.body.toDoText);

    var toDo = new ToDo(req.body);
    toDo.save();
    //append toDo to response
    res.send("Check: " + toDo.doneCheck + "Text: " + toDo.toDoText);
});

app.put("/api/update-checked", function(req, res) {
    //create document

    var conditions = {
        "toDoText": req.body.toDoText.trim()
    };
    var update = {
        $set: {
            "doneCheck": req.body.doneCheck
        }
    };
    // var options = {
    //     multi: false
    // };

    console.log("update-checked check: " + req.body.doneCheck);
    console.log("update-checked text: " + req.body.toDoText);

    ToDo.updateOne(conditions, update, function (err, toDo) {
        if (err) {
            console.log(err);
        } else {
            console.log("update-checked" + toDo);
        }
    });
});
app.listen(3000, 'localhost', () => console.log("listening on port 3000"));