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
        percentBarFill.css('width', '0px');
        percentText.text('0%');
    } else {
        percentBarFill.css('width', '' + Math.round(completed / count * progressBarWidth) + 'px');
        percentText.text('' + Math.round(completed / count * 100) + '%');
    }
}


// Empty list
function clearToDoList() {
    toDoList.text("");
    updateStatsUI();

    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/clear',
        contentType: 'application/json'
    })
}


// Make to-do items 'drag-&-drop'able
function allowDragNDrop() {
    $("#to-do-list").sortable();
    $("#to-do-list").disableSelection();
}


// Restore to-do items  
function load() {

    initialize();
    allowDragNDrop();

    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/retrieve',
        contentType: 'application/json',
        success: function (items) {
            if (items == null) {
                return false;
            }
            $.each(items, function (index, value) {
                addToDo(value.toDoText, value.doneCheck);
            });
            console.log("Get: ", items);
        }
    })
    updateStatsUI();

    // initialize();
    // allowDragNDrop();

    // let items = JSON.parse(localStorage.getItem('items'));
    // if (items == null) {
    //     return false;
    // }
    // $.each(items, function (index, value) {
    //     addToDo(value.toDoText, value.isChecked);
    // });
    // updateStatsUI();
}


// Store to-do items
function unload() {

    // $.each($('.new-item'), function (index, toDoItem) {

    //     let data = {
    //         "doneCheck": toDoItem.firstChild.checked,
    //         "toDoText": toDoItem.firstChild.nextSibling.innerText
    //     };
    //     //console.log("doneCheck: " + toDoItem.firstChild.checked);
    //     //console.log("toDoText: " + toDoItem.firstChild.nextSibling.innerText);
    //     $.ajax({
    //         type: 'POST',
    //         data: JSON.stringify(data),
    //         contentType: 'application/json',
    //         url: 'http://localhost:3000/api/insert'
    //     });
    //     console.log('Post: '+data);
    // });



    // let toDoItems = [];
    // $.each($('.new-item'), function (index, toDoItem) {
    //     let isChecked = toDoItem.firstChild.checked;
    //     let toDoText = toDoItem.firstChild.nextSibling.innerText;
    //     let obj = {
    //         isChecked: isChecked,
    //         toDoText: toDoText
    //     }
    //     toDoItems.push(obj);
    // });
    // localStorage.setItem('items', JSON.stringify(toDoItems));
}


function addToDoAndPost(toDoText = $('#input-text').val(), isChecked) {
    if (isChecked == undefined)
        isChecked = false;

    let data = {
        "doneCheck": isChecked,
        "toDoText": toDoText.trim()
    };
    //console.log("doneCheck: " + toDoItem.firstChild.checked);
    //console.log("toDoText: " + toDoItem.firstChild.nextSibling.innerText);
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/api/insert'
    });
    console.log('Post: ' + data);

    addToDo(toDoText, isChecked)
}


// Create a to-do item—consisting of a checkbox, a para & a delete button—& append to the to-do list
// Provide appropriate event listeners
function addToDo(toDoText = $('#input-text').val(), isChecked) {

    console.log('add function toDoText: ' + toDoText);
    console.log('add function isChecked: ' + isChecked);

    //checkbox
    let toDoCheck = $(`<input type = "checkbox"></input>`);
    toDoCheck.prop('checked', isChecked);
    toDoCheck.addClass('checkbox');
    toDoCheck.on('click', updateChecked);

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
    if (isChecked == undefined) {
        isChecked = false;
    }

}


// Delete to-do item
function deleteToDo(event) {
    $(event.target.parentElement).remove();
    updateStatsUI();

    let data = {
        "doneCheck": event.target.checked,
        "toDoText": event.target.parentElement.firstChild.nextSibling.innerText
    };
    console.log("The miracle: |"+event.target.parentElement.firstChild.nextSibling.innerText+"|");
    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/api/delete'
    });
}


// Update checked
function updateChecked(event) {

    updateStatsUI();

    let data = {
        "doneCheck": event.target.checked,
        "toDoText": event.target.parentElement.firstChild.nextSibling.innerText
    };
    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/api/update-checked'
    });

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
        addToDoAndPost();
    }
}