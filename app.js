const express = require('express')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var bodyParser = require('body-parser');

const fs = require('fs');
let path = require('path');

// init App
const app = express()

// bring in models
let ToDoModel = require('./models/toDo');
let db = mongoose.connection;


// check for db errors
db.on('error', console.error.bind(console, 'connection error'));


// check connection
db.once('open', function () {
    //connected
    console.log('Connected to MongoDB')
});


// project directory
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());


// home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + 'index.html'));
});


// find all documents in db  
app.get("/api/retrieve", (req, res) => {
    ToDoModel.find({}, {}, function (err, toDos) {
        if (err) {
            console.log("retrieve error: " + err);
        } else {
            res.send(toDos);
            console.log("retrieved all documents");
        }
    });
});


// delete selected document
app.put("/api/delete", (req, res) => {
    var conditions = {
        "toDoText": req.body.toDoText.trim()
    };
    ToDoModel.deleteOne(conditions, function (err) {
        if (err) {
            return handleError(err);
            console.log('delete error: ' + err);
        };
        console.log("deleted one document");
    });
});


// delete all documents
app.get("/api/clear", (req, res) => {
    ToDoModel.deleteMany({}, function (err) {
        if (err) {
            return handleError(err);
            console.log('clear error: ' + err);
        };
        console.log("cleared all documents");
    });
});


// insert document
app.post("/api/insert", (req, res) => {

    var toDo = new ToDoModel(req.body);
    toDo.save();
    //append toDo to response
    // res.send("Check: " + toDo.doneCheck + "Text: " + toDo.toDoText);
});


// update document
app.put("/api/update-checked", function (req, res) {

    var conditions = {
        "toDoText": req.body.toDoText.trim()
    };
    var update = {
        $set: {
            "doneCheck": req.body.doneCheck
        }
    };
    ToDoModel.updateOne(conditions, update, function (err, toDo) {
        if (err) {
            console.log('update error: ' + err);
        } else {
            console.log("updated one document");
        }
    });
});


app.listen(3000, 'localhost', () => console.log("listening on port 3000"));