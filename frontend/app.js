const apiBaseUrl = "http://localhost:8000";

// Pobierz wszystkie zadania
async function fetchTasks() {
    const response = await fetch(`${apiBaseUrl}/tasks`);
    const tasks = await response.json();
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');

        // Wyświetl treść zadania
        const taskText = document.createElement('span');
        taskText.textContent = task.task;
        taskText.style.marginRight = '10px';

        // Przycisk do edycji
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.style.marginRight = '5px';
        editButton.onclick = () => {
            const newContent = prompt('Edit task:', task.task);
            if (newContent) {
                updateTask(task.id, newContent);
            }
        };

        // Przycisk do usuwania
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);

        // Dodaj elementy do listy
        li.appendChild(taskText);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
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

// Zaktualizuj zadanie
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
        fetchTasks(); // Odśwież listę
    } else {
        alert('Error updating task.');
    }
}

// Usuń zadanie
async function deleteTask(taskId) {
    const response = await fetch(`${apiBaseUrl}/tasks/${taskId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        fetchTasks(); // Odśwież listę
    } else {
        alert('Error deleting task.');
    }
}

// Załaduj listę zadań na starcie
fetchTasks();
