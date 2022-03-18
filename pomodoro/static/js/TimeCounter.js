// import 'Task.js'

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
    changeMode = (button, mode, timeStart, timeInterval) => {
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