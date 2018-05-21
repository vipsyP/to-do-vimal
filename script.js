var count;
var completed;

var percentText;
var percentBar;
var percentBarFill;
var list;
var inputText;


function initialize() {
    count = 0;
    completed = 0;
    percentText = document.getElementById("percent-text");
    percentBar = document.getElementById("percent-bar");
    percentBarFill = document.getElementById("percent-bar-fill");
    list = document.getElementById("list");
    inputText = document.getElementById("input-text");


}


function updateStats(percentText, percentBar, percentBarFill) {
    var progressBarWidth = getComputedStyle(percentBar).getPropertyValue("width");
    progressBarWidth = progressBarWidth.slice(0, progressBarWidth.length - 2);
    percentBarFill.style.width = "" + Math.round(completed / count * progressBarWidth) + "px";
    percentText.innerHTML = Math.round(completed / count * 100) + "%";
}

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

function loaded() {
    initialize();

    var tempCount;
    if ((tempCount = localStorage.getItem("count")) == null)
        tempCount = 0;
    if ((tempCompleted = localStorage.getItem("completed")) == null)
        tempCompleted = 0;
    tempCount = Number(tempCount);
    tempCompleted = Number(tempCompleted);

    //console.log("1: "+localStorage.getItem("innerList"));
    if ((innerList = localStorage.getItem("innerList")) == null){
        innerList = "";
        return;
    }
    if (innerList.trim() == ""){
        return;
    }
    //console.log("2 "+innerList);

    var tempList = document.createElement('div');
    var body = document.getElementById("body");
    body.appendChild(tempList);
    tempList.innerHTML = innerList;
    console.log(tempList.innerHTML);
    
    var i = 0;
    var listOffspring = tempList.firstChild;
    console.log("check?");

    console.log(listOffspring.innerHTML);
    while (i<tempCount) {
        inputText.value = listOffspring.getElementsByClassName("para")[0].innerHTML; 
        //console.log(inputText.value); 
        console.log(i);
        addToDo();
        listOffspring = listOffspring.nextSibling;
        i = i+1;
    }

    body.removeChild(tempList);


    console.log(tempCount);
    console.log(tempCompleted);
    console.log(innerList);
}

function unloading() {

  localStorage.setItem("count", count);
  localStorage.setItem("completed", completed);
  localStorage.setItem("innerList", list.innerHTML);
  list = document.getElementById("list");


}

function addToDo() {


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
    checkbox.classList.add("checkbox");
    newItem.appendChild(checkbox);


    // handle clicks on checkbox
    checkbox.onclick = function () {
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
    // newItem.addEventListener("mouseover", whenMouseOver);

    // function whenMouseOver(event) {
    //     deleteButton.style.visibility = "visible";
    // }


    //update stats UI, etc
    count++;
    updateStats(percentText, percentBar, percentBarFill);
    inputText.value = "";
    inputText.focus();
}