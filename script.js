const API_URL = "http://127.0.0.1:8000";



document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    try {
        const response = await fetch(`${API_URL}/tasks/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, completed: false }),
        });

        if (response.ok) {
            loadTasks();
            e.target.reset();
        } else {
            console.error("Failed to add task:", await response.text());
        }
    } catch (error) {
        console.error("Error adding task:", error);
    }
});

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks/`);
        if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        const tasks = await response.json();
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";

        tasks.forEach((task) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleCompletion(${task.id})">
                <span style="text-decoration: ${task.completed ? 'line-through' : 'none'};"><strong>${task.title}</strong>: ${task.description}</span>
                <div>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                    <button onclick="showUpdateForm(${task.id}, '${task.title}', '${task.description}')">Update</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
        if (response.ok) loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

function showUpdateForm(id, title, description) {
    const newTitle = prompt("Enter new title:", title);
    const newDescription = prompt("Enter new description:", description);
    if (newTitle && newDescription) updateTask(id, newTitle, newDescription);
}

async function updateTask(id, title, description) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, completed: false }),
        });
        if (response.ok) loadTasks();
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

async function toggleCompletion(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}/toggle`, { method: "PUT" });
        if (response.ok) loadTasks();
    } catch (error) {
        console.error("Error toggling completion:", error);
    }
}

loadTasks();
