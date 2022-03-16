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

// timeCounter class

class timeCounter {
    constructor(countdownInterval, numberOfTask) {
        this.countdownInterval = countdownInterval;
        this.mode = "focus";
        this.numberOfFocus = 0;
        this.numberOfTask = numberOfTask;
        this.focusedTaskId = 0;
    }

    // Displaying helper text
    displayHelper = (text) => {
        const helper_text = document.getElementById("helper-text");
        if (this.focusedTaskId !== 0) {
            helper_text.textContent = document.getElementById(`task-${this.focusedTaskId}`).
                                        getElementsByTagName("span")[0].textContent;
        } else {
            helper_text.textContent = text;
        }
    }

    // Choosing task 
    chooseTask = (taskId) => {
        const taskCard = document.getElementById(taskId);

        if (this.focusedTaskId !== parseInt(taskId.replace("task-", ""))) {
            // De-select other task
            if (this.focusedTaskId !== 0) 
                document.getElementById(`task-${this.focusedTaskId}`).classList.remove("task-card-selected");

            // Update focused task
            this.focusedTaskId = parseInt(taskId.replace("task-", ""));

            // Styling card
            taskCard.classList.add("task-card-selected");

            // Display helper
            this.displayHelper("");

        } else {
            taskCard.classList.remove("task-card-selected");

            this.focusedTaskId = 0;

            const helper_text = this.mode == "focus" ? "Time to focus!" : "Time for a break!";
            this.displayHelper(helper_text);
        }
    }

    // Add new task card before "Add task" button
    newTask = (taskName, taskNote) => {
        // Update meta information
        this.numberOfTask++;

        // Div for name
        const nameDiv = document.createElement("div");;
        const nameDivSpan = document.createElement("span");
        nameDivSpan.textContent = taskName;
        const nameDivButton = document.createElement("button");
        nameDivButton.textContent = "⫶";
        nameDivButton.className = "task-setting-button";

        nameDiv.appendChild(nameDivSpan);
        nameDiv.appendChild(nameDivButton);

        // Div for note
        const noteDiv = document.createElement("div");
        noteDiv.className = "task-note";
        noteDiv.textContent = taskNote;

        // Create new task card
        const newDiv = document.createElement("div");
        newDiv.id = `task-${this.numberOfTask}`;
        newDiv.className = "task-card";
        newDiv.appendChild(nameDiv);
        if (taskNote !== "") newDiv.appendChild(noteDiv);

        newDiv.addEventListener("click", () => this.chooseTask(newDiv.id));

        document.getElementsByClassName("task-card-group")[0].insertBefore(newDiv, addTaskButton);

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
        this.displayHelper(helper_text);
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

const timeCounterFocus = new timeCounter(focusDefault, 0);

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