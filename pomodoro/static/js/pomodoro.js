// Setting default period
const focusDefault = 1*60*1000;
const shortDefault = 2*60*1000;
const longDefault = 3*60*1000;

// Button and input

const settingButton = document.getElementById("button-setting");
const settingCard = document.getElementById("setting-card-background");
const closeButton = document.getElementById("button-close");
const okButton = document.getElementById("button-setting-ok");

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

const timeCounterFocus = new TimeCounter(focusDefault, 2, focusDefault, shortDefault, longDefault);

const task1 = new Task(1, "Studying", "Let's code");
taskList[1] = task1;
const task2 = new Task(2, "Gaming", "");
taskList[2] = task2;
Task.renderTaskList();

/*
    Setting
*/

settingButton.addEventListener("click", () => { 

    document.getElementById("focus-length").value = timeCounterFocus.focusTime/60/1000;
    document.getElementById("short-length").value = timeCounterFocus.shortTime/60/1000;
    document.getElementById("long-length").value = timeCounterFocus.longTime/60/1000;
    document.getElementById("auto-start-break").checked = timeCounterFocus.autoBreak;
    document.getElementById("auto-start-focus").checked = timeCounterFocus.autoFocus;
    document.getElementById("long-break-interval").value = timeCounterFocus.longBreakInterval;

    settingCard.style.display = "block"; 
});

closeButton.addEventListener("click", () => { settingCard.style.display = "none"; });
settingCard.addEventListener("click", (e) => {
    if (e.target === document.getElementById("setting-card-background")) settingCard.style.display = "none";
});

okButton.addEventListener("click", (e) => {
    e.preventDefault();

    const focusTime = document.getElementById("focus-length").value*60*1000;
    const shortTime = document.getElementById("short-length").value*60*1000;
    const longTime = document.getElementById("long-length").value*60*1000;
    const autoBreak = document.getElementById("auto-start-break").checked;
    const autoFocus = document.getElementById("auto-start-focus").checked;
    const longBreakInterval = document.getElementById("long-break-interval").value*1;

    timeCounterFocus.update(focusTime, shortTime, longTime, autoBreak, autoFocus, longBreakInterval);

    settingCard.style.display = "none";
});

/*
    Mode-changing buttons
*/

// Selecting the buttons 

focusButton.addEventListener("click", focusMode = () => 
                            timeCounterFocus.changeMode(focusButton, "focus", timeCounterFocus.focusTime));
shortButton.addEventListener("click", shortMode = () => 
                            timeCounterFocus.changeMode(shortButton, "short", timeCounterFocus.shortTime));
longButton.addEventListener("click", longMode = () => 
                            timeCounterFocus.changeMode(longButton, "long", timeCounterFocus.longTime));

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