// Setting default period
const focusDefault = 3*1000;
const shortDefault = 5*1000;
const longDefault = 10*1000;

// Button and input

const focusButton = document.getElementById("mode-focus");
const shortButton = document.getElementById("mode-short");
const longButton = document.getElementById("mode-long");

const addTaskButton = document.getElementById("add-task-button");
const addTaskForm = document.getElementById("add-task-form");
const cancelButton = document.getElementById("button-cancel");
const addButton = document.getElementById("button-add");

const taskNameInput = document.getElementById("task-name");
const taskNoteInput = document.getElementById("task-note");

// global var

let taskList = {};

// task class

class Task {
    constructor(taskId, taskName, taskNote) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.taskNote = taskNote;
        this.completed = false;
        this.selected = false;
    }

    renderTask = () => {
        // Create new task card
        /*
            <div id="task-${id}" class="task-card">
                <div>
                    <span>${taskName}</span>
                    <button class="task-setting-button">✓</button>
                </div>
                <div class="task-note">${taskNote}/div>
            </div>
        */

        // div for name
        const nameDiv = document.createElement("div");;
        const nameDivSpan = document.createElement("span");
        nameDivSpan.textContent = this.taskName;
        if (this.completed) nameDivSpan.classList.add("completed-task");

        const nameDivButton = document.createElement("button");
        nameDivButton.textContent = "✓";
        nameDivButton.className = "task-setting-button";
        nameDivButton.addEventListener("click", () => this.completeTask());

        nameDiv.appendChild(nameDivSpan);
        nameDiv.appendChild(nameDivButton);

        // div for note
        const noteDiv = document.createElement("div");
        noteDiv.className = "task-note";
        noteDiv.textContent = this.taskNote;

        // add to new div
        const newDiv = document.createElement("div");
        newDiv.id = `task-${this.taskId}`;
        newDiv.className = "task-card";
        if (this.selected) newDiv.classList.add("task-card-selected");
        newDiv.appendChild(nameDiv);
        if (this.taskNote !== "") newDiv.appendChild(noteDiv);
            
        newDiv.addEventListener("click", (e) => {
            if (!e.target.classList.contains('task-setting-button'))
                this.selectTask();
        });

        document.getElementsByClassName("task-card-group")[0].insertBefore(newDiv, addTaskButton);
    }

    static renderTaskList = () => {
        // Displaying helper text
        const helper_text = document.getElementById("helper-text");
        let new_helper_text = timeCounterFocus.mode === "focus" ? "Time to focus!" : "Time for a break!"

        // Clear old task cards
        const oldTaskList = document.getElementsByClassName('task-card');
        while (oldTaskList.length > 1) oldTaskList[0].remove();

        // Render new task cards
        for (let i in taskList) {
            taskList[i].renderTask();
            if (taskList[i].selected == true) new_helper_text = taskList[i].taskName;
        }

        helper_text.textContent = new_helper_text;
    }

    completeTask = () => {
        this.completed = !this.completed;
        Task.renderTaskList();
    }

    selectTask = () => {
        if (!this.selected) for (let t in taskList) 
            if (taskList[t].taskId !== this.taskId) taskList[t].selected = false;
        this.selected = !this.selected;
        Task.renderTaskList();
    };
}

// TimeCounter class

class TimeCounter {
    constructor(countdownInterval, numberOfTask) {
        this.countdownInterval = countdownInterval;
        this.mode = "focus";
        this.numberOfFocus = 0;
        this.numberOfTask = numberOfTask;
    }

    // Add new task card before "Add task" button
    newTask = (taskName, taskNote) => {
        // Update meta information
        this.numberOfTask++;

        // Render task
        const newTask = new Task(this.numberOfTask, taskName, taskNote);
        taskList[this.numberOfTask] = newTask;
        Task.renderTaskList();
    }
    
    // Helper function for mode-button
    changeMode = (button, mode, helper_text, timeStart, timeInterval) => {
        // Display new countdown
        document.getElementById("countdown").textContent = timeStart;

        // Set new interval
        this.countdownInterval = timeInterval;
        this.mode = mode;

        // Focus on clicked button (and un-focus the other buttons)
        const modeButtonGroup = document.getElementsByClassName("mode-button");
        for (let i = 0; i<modeButtonGroup.length; i++) { 
            let selected = modeButtonGroup[i];
            if (selected === button) selected.style.background = "none rgba(0, 0, 0, 0.15)";
            else selected.style.background = "none";
        }

        // Changing color
        document.getElementsByTagName("body")[0].classList.value = "color-" + mode;
        document.getElementById("button-start").classList.value = "counter-start color-" + mode;
        document.getElementById("button-skip").classList.value = "counter-start color-" + mode;

        // Change helper text
        Task.renderTaskList();
    }

    timesUp = () => {
        // Alerting
        alert("Time's up!");

        // Hide skip button
        const skipButton = document.getElementById("button-skip");
        skipButton.style.display = "none";

        // Changing mode and displaying period
        if (this.mode === "focus") {
            this.mode = "break";
            this.countdownInterval = shortDefault;
            this.numberOfFocus++;
            document.getElementById("period").textContent = `#${this.numberOfFocus + 1}`;

            if (this.numberOfFocus % 4 == 0) {
                this.countdownInterval = longDefault;
                longMode();
            }
            else shortMode();
        } else {
            this.mode = "focus";
            this.countdownInterval = focusDefault;
            focusMode();
        }
    }

    startCounting = () => {

        // Setting up
        const startButton = document.getElementById("button-start");
        const startButtonText = startButton.getElementsByTagName("span")[0];
        let countdownInterval = this.countdownInterval;
        const timesUp = this.timesUp;

        const stopCounting = () => {
            this.countdownInterval = countdownInterval;
            clearInterval(counting);
            startButtonText.style.transform = "translateY(-6px)";
            startButtonText.textContent = "Start";
            startButton.onclick = this.startCounting;
        }

        const skip = () => {
            countdownInterval = 0;
        }

        // Pushing the button and change its function
        startButtonText.style.transform = "none";
        startButtonText.textContent = "Stop";
        startButton.onclick = stopCounting;

        // Displaying skip button
        const skipButton = document.getElementById("button-skip");
        skipButton.style.display = "inline";
        skipButton.onclick = skip;

        // Update the count down every 1 second
        let countdownStart = new Date().getTime(); 
        let counting = setInterval(() => {

            // Get today's date and time
            let now = new Date().getTime();

            // Find the distance between now and the count down start
            countdownInterval -= (now - countdownStart);
            countdownStart = now;
            let distance = countdownInterval;

            // Time calculations for days, hours, minutes and seconds
            if (distance < 0) distance = 0;
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // If the count down is finished, alert
            if (distance <= 0) {
                stopCounting();
                timesUp();
            }

            // Display the result in the element with id="countdown"
            document.getElementById("countdown").textContent = minutes + ":" + seconds;
            document.getElementsByTagName("title")[0].textContent = minutes + ":" + seconds;

        }, 100);
    }
}

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
                            timeCounterFocus.changeMode(focusButton, "focus", "Time to focus!", "0:3", focusDefault));
shortButton.addEventListener("click", shortMode = () => 
                            timeCounterFocus.changeMode(shortButton, "short", "Time for a break!", "0:5", shortDefault));
longButton.addEventListener("click", longMode = () => 
                            timeCounterFocus.changeMode(longButton, "long", "Time for a break!", "0:10", longDefault));

/*
    Start button
*/

document.getElementById("button-start").onclick = timeCounterFocus.startCounting;

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