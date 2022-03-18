// import 'TimeCounter.js'

// List of tasks

let taskList = {};

// Task class

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
    }

    static clearCompletedTasks = () => {
        for (let t in taskList)
            if (taskList[t].completed) delete taskList[t];
        Task.renderTaskList();
    }

    static clearAllTasks = () => {
        taskList = {};
        Task.renderTaskList();
    }
}