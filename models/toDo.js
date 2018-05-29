let mongoose = require('mongoose');

//Article Schema
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
module.exports = mongoose.model('ToDoItem', toDoItemSchema, 'todoitems');