// Setting default period
const focusDefault = 3*1000;
const shortDefault = 5*1000;
const longDefault = 10*1000;

// Button and input

const focusButton = document.getElementById("mode-focus");
const shortButton = document.getElementById("mode-short");
const longButton = document.getElementById("mode-long");

const taskSettingButton = document.getElementById("button-task-setting");
const clearCompletedButton = document.getElementById("button-clear-completed");
const clearAllButton = document.getElementById("button-clear-all");
const dropdownSetting = document.getElementById("task-setting-dropdown");

const addTaskButton = document.getElementById("add-task-button");
const addTaskForm = document.getElementById("add-task-form");
const cancelButton = document.getElementById("button-cancel");
const addButton = document.getElementById("button-add");

const taskNameInput = document.getElementById("task-name");
const taskNoteInput = document.getElementById("task-note");

const timeCounterFocus = new TimeCounter(focusDefault, 2);

const task1 = new Task(1, "Studying", "Let's code");
taskList[1] = task1;
const task2 = new Task(2, "Gaming", "");
taskList[2] = task2;
Task.renderTaskList();

/*
    Mode-changing buttons
*/

// Selecting the buttons 

focusButton.addEventListener("click", focusMode = () => 
                            timeCounterFocus.changeMode(focusButton, "focus", "0:3", focusDefault));
shortButton.addEventListener("click", shortMode = () => 
                            timeCounterFocus.changeMode(shortButton, "short", "0:5", shortDefault));
longButton.addEventListener("click", longMode = () => 
                            timeCounterFocus.changeMode(longButton, "long", "0:10", longDefault));

/*
    Start button
*/

document.getElementById("button-start").onclick = timeCounterFocus.startCounting;

/*
    Task setting buttons
*/

// Display dropdown menu

taskSettingButton.addEventListener("click", () => {
    if (dropdownSetting.style.display != "block")
        dropdownSetting.style.display = "block";
    else dropdownSetting.style.display = "none";
});

// Clearing tasks

clearCompletedButton.addEventListener("click", () => Task.clearCompletedTasks());
clearAllButton.addEventListener("click", () => Task.clearAllTasks());

/*
    Add task button
*/

addTaskButton.addEventListener("click", () => {
    addTaskButton.style.display = "none";
    addTaskForm.style.display = "block";
    addTaskForm.scrollIntoView();
})

/*
    Add task card
*/

// Tracking input

let taskName = "";
let taskNote = "";

taskNameInput.addEventListener("input", (e) => {
    taskName = e.target.value;
    if (taskName === "") addButton.disabled = true;
    else addButton.disabled = false;
})

taskNoteInput.addEventListener("input", (e) => {
    taskNote = e.target.value;
})

cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    addTaskButton.style.display = "block";
    addTaskForm.style.display = "none";
    addTaskButton.scrollIntoView();
})

addButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Add new task card (new div)
    timeCounterFocus.newTask(taskName, taskNote);

    // Hide form
    taskName = "";
    addButton.disabled = true;
    taskNote = "";
    taskNameInput.value = "";
    taskNoteInput.value = "";
    addTaskForm.style.display = "none";
    addTaskButton.style.display = "block";
})