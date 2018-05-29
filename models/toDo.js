let mongoose = require('mongoose');

//Schema
let toDoItemSchema = mongoose.Schema({
    doneCheck: {
        type: Boolean,
        required: true
    },

    toDoText: {
        type: String,
        required: true
    },

});

//Model
module.exports = mongoose.model('ToDoItem', toDoItemSchema, 'todoitems');