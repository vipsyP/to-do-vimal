var count = 0;
var completed = 0;

function add() {

    percentTextstyle = document.getElementById("percentText");
    percentBar = document.getElementById("percent-bar");
    percentBarFill = document.getElementById("percent-bar-fill");
    list = document.getElementById("list");
    inputText = document.getElementById("input-text");


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
        } else {
            completed--;
            newItem.style.textDecoration = "none";
        }

        var progressBarWidth = getComputedStyle(percentBar).getPropertyValue("width");
        progressBarWidth = progressBarWidth.slice(0, progressBarWidth.length - 2);
        percentBarFill.style.width = "" + Math.round(completed / count * progressBarWidth) + "px";
        percentText.innerHTML = Math.round(completed / count * 100) + "%";
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

        percentBarFill.style.width = "" + Math.round(completed / count * 340) + "px";
        percentText.innerHTML = Math.round(completed / count * 100) + "%";
    }


    //append the to-do to the list
    list.appendChild(newItem);


    // handle hover over to-do 
    newItem.onmouseover = function () {
        deleteButton.style.visibility = "visible";
    }
    newItem.onmouseout = function () {
        deleteButton.style.visibility = "hidden";
    }

    //update stats UI
    count++;
    percentBarFill.style.width = "" + Math.round(completed / count * 340) + "px";
    percentText.innerHTML = Math.round(completed / count * 100) + "%";
    inputText.value = "";
}