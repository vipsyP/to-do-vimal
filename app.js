var count;
var completed;
var percentText;
var percentBar;
var percentBarFill;
var toDoList;
var inputText;


// Get references to HTML elements - stats UI, to do list, input text
function initialize() {
    percentText = $("#percent-text");
    percentBar = $("#percent-bar");
    percentBarFill = $("#percent-bar-fill");
    toDoList = $("#to-do-list");
    inputText = $("#input-text");
}


// Count number of to do items 
// & number of completed to do items
function countItems() {
    count = 0;
    completed = 0;
    $.each($('.new-item'), function (index, toDoItem) {
        count++;
        if (toDoItem.firstChild.checked)
            completed++;

    });
}


// Update stats UI - percent text, percent bar
function updateStatsUI() {
    countItems();
    var progressBarWidth = percentBar.css('width');
    progressBarWidth = Number(progressBarWidth.slice(0, progressBarWidth.length - 2));
    if (count == 0) {
        percentBarFill.css('width', '0px')
        console.log(percentBarFill.css('width'));
        console.log(percentBarFill);
        percentText.text('0%');
    } else {
        percentBarFill.css('width', '' + Math.round(completed / count * progressBarWidth) + 'px')
        percentText.text('' + Math.round(completed / count * 100) + '%');
    }
}


// Empty list
function clearToDoList() {
    toDoList.text("");
    updateStatsUI();
}

// Make to-do items 'drag-&-drop'able
function allowDragNDrop() {
    $("#to-do-list").sortable();
    $("#to-do-list").disableSelection();
}


// Get to-do items—stored as array of objects—from localStorage 
// Dynamically create to-do items & populate the to-do list 
function load() {
    initialize();
    allowDragNDrop();

    let items = JSON.parse(localStorage.getItem('items'));
    if (items == null) {
        return false;
    }
    $.each(items, function (index, value) {
        addToDo(value.toDoText, value.isChecked);
    });
    updateStatsUI();
}


// Store to-do items as array of objects inside localStorage
function unload() {
    let toDoItems = [];
    $.each($('.new-item'), function (index, toDoItem) {
        let isChecked = toDoItem.firstChild.checked;
        let toDoText = toDoItem.firstChild.nextSibling.innerText;
        let obj = {
            isChecked: isChecked,
            toDoText: toDoText
        }
        toDoItems.push(obj);
    });
    localStorage.setItem('items', JSON.stringify(toDoItems));
}


// Create a to-do item—consisting of a checkbox, a para & a delete button—& append to the to-do list
// Provide appropriate event listeners
function addToDo(toDoText = $('#input-text').val(), isChecked) {

    //checkbox
    let toDoCheck = $(`<input type = "checkbox"></input>`);
    toDoCheck.prop('checked', isChecked);
    toDoCheck.addClass('checkbox');
    toDoCheck.on('click', updateStatsUI);

    //para
    let toDoPara = $(`<p>${toDoText}</p>`);
    toDoPara.addClass('para');

    //delete button
    let toDoDeleteImg = $(`<img src = "img/delete.png"/>`);
    toDoDeleteImg.addClass('delete-button').css('visibility', 'visible');
    toDoDeleteImg.css('visibility', 'hidden');
    toDoDeleteImg.on('click', deleteToDo);

    //to-do item
    let toDoListItem = $('<li></li>').append(toDoCheck).append(toDoPara).append(toDoDeleteImg);
    toDoListItem.addClass('new-item');
    toDoListItem.on('mouseenter', function () {
        toDoDeleteImg.css('visibility', 'visible')
    });
    toDoListItem.on('mouseleave', function () {
        toDoDeleteImg.css('visibility', 'hidden')
    });
    toDoList.append(toDoListItem);

    //reset value of input text & bring back focus
    inputText.val('');
    inputText.focus();

    updateStatsUI();
}


// Delete to-do item
function deleteToDo(event) {
    $(event.target.parentElement).remove();
    updateStatsUI();
}


//capture enter key released
function keyUp(event) {
    event.preventDefault();
    //return if edit text contains only whitespaces
    if (inputText.val().trim() == "") {
        inputText.val('');
        return;
    }
    if (event.key === 'Enter') {
        addToDo();
    }
}