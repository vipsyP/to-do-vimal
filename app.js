var percentText;
var percentBar;
var percentBarFill;
var toDoList;
var inputText;

function initialize() {
    percentText = $("#percent-text");
    percentBar = $("#percent-bar");
    percentBarFill = $("#percent-bar-fill");
    toDoList = $("#to-do-list");
    inputText = $("#input-text");
}

// function updateStatsUI() {
//     // var progressBarWidth = getComputedStyle(percentBar).getPropertyValue("width");
//     progressBarWidth.css();
//     progressBarWidth = progressBarWidth.slice(0, progressBarWidth.length - 2);
//     if (count == 0) {
//         percentBarFill.style.width = "0px";
//         percentText.innerHTML = "0%";
//     } else {
//         percentBarFill.style.width = "" + Math.round(completed / count * progressBarWidth) + "px";
//         percentText.innerHTML = Math.round(completed / count * 100) + "%";
//     }
// }

function load() {
    initialize();

    let items = JSON.parse(localStorage.getItem('items'));
    if (items == null) {
        return false;
    }

    $.each(items, function (index, value) {
        console.log(index,value);
        addToDo(value.toDoText, value.isChecked);
    });
}

function unload() {
    let toDoItems = [];
    $.each($('.new-item'), function(index, toDoItem){
        let isChecked = toDoItem.firstChild.checked;
        let toDoText = toDoItem.firstChild.nextSibling.innerText;
        let obj = {
            isChecked : isChecked,
            toDoText : toDoText
        }
        toDoItems.push(obj);
    });
    
    localStorage.setItem('items',JSON.stringify(toDoItems));
}

function addToDo(toDoText = $('#input-text').val(), isTrue) {
    console.log(isTrue + " : " + toDoText);

    //checkbox
    let toDoCheck = $(`<input type = "checkbox"></input>`);
    toDoCheck.prop('checked', isTrue);
    toDoCheck.addClass('checkbox');

    //para
    let toDoPara = $(`<p>${toDoText}</p>`);
    toDoPara.addClass('para');

    //delete button
    let toDoDeleteImg = $(`<img src = "img/delete.png"/>`);
    toDoDeleteImg.addClass('delete-button').css('visibility', 'visible');
    toDoDeleteImg.on('click', deleteToDo);

    //to do item
    let toDoListItem = $('<li></li>').append(toDoCheck).append(toDoPara).append(toDoDeleteImg);
    toDoListItem.addClass('new-item');
    toDoList.append(toDoListItem);

    //reset value of input text & bring back focus
    inputText.val('');
    inputText.focus();
}

function deleteToDo(event) {
    $(event.target.parentElement).remove();
}

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