const apiBaseUrl = "http://localhost:8000";

// Pobierz wszystkie zadania
async function fetchTasks() {
    const response = await fetch(`${apiBaseUrl}/tasks`);
    const tasks = await response.json();
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = "task-item";

        // Wyświetl treść zadania
        const taskText = document.createElement('span');
        taskText.textContent = task.task;

        // Kontener na przyciski
        const buttonContainer = document.createElement('div');
        buttonContainer.className = "task-item-buttons";

        // Przycisk edycji
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-edit';
        editButton.textContent = 'Edit';
        editButton.onclick = () => {
            const newContent = prompt('Edit task:', task.task);
            if (newContent) {
                updateTask(task.id, newContent);
            }
        };

        // Przycisk usunięcia
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-delete';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);

        // Dodaj przyciski do kontenera
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        // Dodaj elementy do listy
        li.appendChild(taskText);
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
    });
}

// Dodaj nowe zadanie
async function addTask() {
    const taskInput = document.getElementById('task-input');
    const newTask = { task: taskInput.value };
    const response = await fetch(`${apiBaseUrl}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
    });
    if (response.ok) {
        taskInput.value = '';
        fetchTasks(); // Odśwież listę
    } else {
        alert('Error adding task.');
    }
}

async function updateTask(taskId, newContent) {
    const updatedTask = { task: newContent };
    const response = await fetch(`${apiBaseUrl}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    });
    if (response.ok) {
        fetchTasks();
    } else {
        alert('Error updating task.');
    }
}

async function deleteTask(taskId) {
    const response = await fetch(`${apiBaseUrl}/tasks/${taskId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        fetchTasks();
    } else {
        alert('Error deleting task.');
    }
}

fetchTasks();
