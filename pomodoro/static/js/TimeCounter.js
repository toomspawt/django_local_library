// import 'Task.js'

// TimeCounter class

class TimeCounter {
    constructor(countdownInterval, numberOfTask, focusTime, shortTime, longTime) {
        this.countdownInterval = countdownInterval;
        this.mode = "focus";
        this.numberOfFocus = 0;
        this.numberOfTask = numberOfTask;
        this.isCounting = false;
        this.focusTime = focusTime;
        this.shortTime = shortTime;
        this.longTime = longTime;
        this.autoBreak = false;
        this.autoFocus = false;
        this.longBreakInterval = 4;
        this.renderCountdown();
    }

    // Add new task card 
    newTask = (taskName, taskNote) => {
        // Update meta information
        this.numberOfTask++;

        // Render task
        const newTask = new Task(this.numberOfTask, taskName, taskNote);
        taskList[this.numberOfTask] = newTask;
        Task.renderTaskList();
    }

    renderCountdown() {
        let minutes = Math.floor((this.countdownInterval % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((this.countdownInterval % (1000 * 60)) / 1000);
        document.getElementById("countdown").textContent = minutes + ":" + seconds;
        document.getElementsByTagName("title")[0].textContent = minutes + ":" + seconds;
    }
    
    // Helper function for mode-button
    changeMode = (button, mode, timeInterval) => {
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
        
        // Render timer
        this.renderCountdown();

        // If auto start is set, start counting immediately
        if (this.mode == "focus") {
            if (this.autoFocus) this.startCounting();
        } else if (this.autoBreak) this.startCounting();
    }

    update = (focusTime, shortTime, longTime, autoBreak, autoFocus, longBreakInterval) => {
        // Stop counting
        this.isCounting = false;

        // Update state
        this.focusTime = focusTime;
        this.shortTime = shortTime;
        this.longTime = longTime;
        this.autoBreak = autoBreak;
        this.autoFocus = autoFocus;
        this.longBreakInterval = longBreakInterval;
        switch (this.mode) {
            case "focus": 
                this.countdownInterval = this.focusTime;
                break;
            case "short": 
                this.countdownInterval = this.shortTime;
                break;
            case "long": 
                this.countdownInterval = this.longTime;
                break;
        }
        
        this.renderCountdown();
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

            if (this.numberOfFocus % this.longBreakInterval == 0) {
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
        this.isCounting = true;
        const startButton = document.getElementById("button-start");
        const startButtonText = startButton.getElementsByTagName("span")[0];
        const skipButton = document.getElementById("button-skip");

        //let countdownInterval = this.countdownInterval;
        const timesUp = this.timesUp;

        const stopCounting = () => {
            this.isCounting = false;
            clearInterval(counting);
            skipButton.style.display = "none";
            startButtonText.style.transform = "translateY(-6px)";
            startButtonText.textContent = "Start";
            startButton.onclick = this.startCounting;
        }

        const skip = () => {
            this.countdownInterval = 0;
        }

        // Pushing the button and change its function
        startButtonText.style.transform = "none";
        startButtonText.textContent = "Stop";
        startButton.onclick = stopCounting;

        // Displaying skip button
        skipButton.style.display = "inline";
        skipButton.onclick = skip;

        // Update the count down every 1 second
        let countdownStart = new Date().getTime(); 
        let counting = setInterval(() => {

            if (!this.isCounting) stopCounting();

            // Get today's date and time
            let now = new Date().getTime();

            // Find the distance between now and the count down start
            this.countdownInterval -= (now - countdownStart);
            countdownStart = now;

            // Time calculations for days, hours, minutes and seconds
            if (this.countdownInterval < 0) this.countdownInterval = 0;

            // If the count down is finished, alert
            if (this.countdownInterval <= 0) {
                stopCounting();
                timesUp();
            }

            this.renderCountdown();
        }, 100);
    }
}