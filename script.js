var count;
var completed;

var percentText;
var percentBar;
var percentBarFill;

var list;
var inputText;

var checkOrNot;

var source;

function initialize() {
    count = 0;
    completed = 0;
    checkOrNot = false;
    percentText = document.getElementById("percent-text");
    percentBar = document.getElementById("percent-bar");
    percentBarFill = document.getElementById("percent-bar-fill");
    list = document.getElementById("list");
    inputText = document.getElementById("input-text");
}

// UPDATE STATS UI-- PERCENT TEXT, BAR, & FILL
function updateStats(percentText, percentBar, percentBarFill) {
    var progressBarWidth = getComputedStyle(percentBar).getPropertyValue("width");
    progressBarWidth = progressBarWidth.slice(0, progressBarWidth.length - 2);
    percentBarFill.style.width = "" + Math.round(completed / count * progressBarWidth) + "px";
    percentText.innerHTML = Math.round(completed / count * 100) + "%";
}

//CAPTURE ENTER KEY UP 
function keyUp(event) {
    event.preventDefault();

    inputText = document.getElementById("input-text");
    //return if edit text contains only whitespaces
    if (inputText.value.trim() == "") {
        inputText.value = "";
        return;
    }
    if (event.keyCode === 13) {
        document.getElementById("add").click();
    }
}

// WHEN THE DOCUMENT LOADS
function loaded() {
    initialize();

    //get count & completed from localStorage--actually redundant
    var tempCount;
    if ((tempCount = localStorage.getItem("count")) == null)
        tempCount = 0;
    if ((tempCompleted = localStorage.getItem("completed")) == null)
        tempCompleted = 0;
    tempCount = Number(tempCount);
    tempCompleted = Number(tempCompleted);

    //get list from localStorage
    //if list is empty, there's nothing to load
    if ((innerList = localStorage.getItem("innerList")) == null) {
        innerList = "";
        return;
    }
    if (innerList.trim() == "") {
        return;
    }

    //create a temporary list--for iterating on to-do items from localStorage
    var tempList = document.createElement('div');

    //attach temporary list to body--temporarily of course 
    var body = document.getElementById("body");
    body.appendChild(tempList);
    tempList.innerHTML = innerList;

    //iterate through the to-do's of the temporary list
    var i = 0;
    var listOffspring = tempList.firstChild;
    while (i < tempCount) {

        //store to-do text
        inputText.value = listOffspring.getElementsByClassName("para")[0].innerHTML;

        //record checkbox state
        if (listOffspring.getElementsByTagName("input")[0].className == null) {
            listOffspring.getElementsByTagName("input")[0].className = "checkbox";
        }
        if (listOffspring.getElementsByTagName("input")[0].className == "checkbox checked") {
            checkOrNot = true;
        } 
        else {
            checkOrNot = false;
        }

        // create to-do & append to actual list
        addToDo(true);

        listOffspring = listOffspring.nextSibling;
        i = i + 1;
    }

    // delete temporary list
    body.removeChild(tempList);
}

// WHEN THE USER CLOSES THE PAGE OR RELOADS
function unloading1() {
    //store count, completed, & list to localStorage
    localStorage.setItem("count", count);
    localStorage.setItem("completed", completed);
    localStorage.setItem("innerList", list.innerHTML);
    list = document.getElementById("list");
}
function unloading() {
}

//ADD TO-DO
function addToDo(fromLoaded) {
    if (!fromLoaded) {
        checkOrNot = false;
    }

    //return if task is empty
    if (inputText.value == "") {
        return;
    }

    //create container for checkbox, para
    var newItem = document.createElement('div');
    newItem.classList.add("new-item");


    // append checkbox
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    console.log(checkbox.className);
    //restore checkbox state from localStorage
    if (checkOrNot) {
        console.log("okay?");
        checkbox.checked = true;
        completed++;
        newItem.style.textDecoration = "line-through";
        checkbox.classList.add("checked");
    } else {
        checkbox.classList.remove("checked");
    }
    updateStats(percentText, percentBar, percentBarFill);
    newItem.appendChild(checkbox);

    // handle clicks on checkbox
    checkbox.onclick = function () {
        //console.log("hahaha: "+checkbox.className);
        if (checkbox.checked == true) {
            completed++;
            newItem.style.textDecoration = "line-through";
            checkbox.classList.add("checked");
        } else {
            completed--;
            newItem.style.textDecoration = "none";
            checkbox.classList.remove("checked");
        }

        updateStats(percentText, percentBar, percentBarFill);
    }

    //append para
    var para = document.createElement('p');
    para.classList.add("para");
    para.innerHTML = inputText.value;
    newItem.appendChild(para);

    //append delete button
    var deleteButton = document.createElement('img');
    deleteButton.classList.add("delete-button");
    deleteButton.src = "img/delete.png";
    deleteButton.style.visibility = "hidden";
    newItem.appendChild(deleteButton);

    //handle clicks on the delete button
    deleteButton.onclick = function () {
        if (checkbox.checked == true) {
            completed--;
        }

        var listChild = newItem;
        var i = 0;
        while ((listChild = listChild.previousSibling) != null)
            i++;
        console.log("Index of deleted item: " + i);
        list.removeChild(list.childNodes[i]);

        count--;
        if (count == 0) {
            console.log("No more to-do's");
            percentBarFill.style.width = "0px";
            percentText.innerHTML = "0%";
            return;
        }

        updateStats(percentText, percentBar, percentBarFill);
    }

    //append the to-do to the list
    list.appendChild(newItem);

    //handle hover over to-do
    newItem.onmouseover = function () {
        deleteButton.style.visibility = "visible";
    }
    newItem.onmouseout = function () {
        deleteButton.style.visibility = "hidden";
    }

    //To make an element draggable
    newItem.draggable = "true";

    // sets the data type and the value of the dragged data.
    newItem.ondragstart = function (e){
        source = e.target;
    }

    // By default, data/elements cannot be dropped in other elements. 
    // To allow a drop, we must prevent the default handling of the element.
    newItem.ondragover = function (e){
        e.preventDefault();

    }

    newItem.ondrop = function(e) {
        e.preventDefault();
        var temp = source.innerHTML;

        console.log("1: "+source.innerHTML);
        console.log("2: "+e.target.innerHTML);
        source.innerHTML = e.target.innerHTML;
        e.target.innerHTML= temp;
    }


    //update stats UI, etc
    count++;
    updateStats(percentText, percentBar, percentBarFill);
    inputText.value = "";
    inputText.focus();
}