let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let columns = document.querySelectorAll('.column');
let createTaskBtn = document.getElementById('create-task-btn');
let createTaskModal = document.getElementById('create-task-modal');
let createTaskForm = document.getElementById('create-task-form');
let taskNameInput = document.getElementById('task-name');
let taskDescriptionInput = document.getElementById('task-description');

// Create task
createTaskBtn.addEventListener('click', () => {
    createTaskModal.style.display = 'block';
});

createTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let taskName = taskNameInput.value;
    let taskDescription = taskDescriptionInput.value;
    let newTask = {
        name: taskName,
        description: taskDescription,
        status: 'to-do'
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    createTaskModal.style.display = 'none';
    taskNameInput.value = '';
    taskDescriptionInput.value = '';
});

// Render tasks
function renderTasks() {
    let toDoTasks = document.getElementById('to-do-tasks');
    let inProgressTasks = document.getElementById('in-progress-tasks');
    let completedTasks = document.getElementById('completed-tasks');
    toDoTasks.innerHTML = '';
    inProgressTasks.innerHTML = '';
    completedTasks.innerHTML = '';
    tasks.forEach((task) => {
        let taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `<h3>${task.name}</h3><p>${task.description}</p>`;
        taskElement.setAttribute('draggable', 'true');
        taskElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('task', JSON.stringify(task));
        });
        if (task.status === 'to-do') {
            toDoTasks.appendChild(taskElement);
        } else if (task.status === 'in-progress') {
            inProgressTasks.appendChild(taskElement);
        } else if (task.status === 'completed') {
            completedTasks.appendChild(taskElement);
        }
    });
}

// Drag and drop
columns.forEach((column) => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    column.addEventListener('drop', (e) => {
        e.preventDefault();
        let task = JSON.parse(e.dataTransfer.getData('task'));
        let columnId = column.id;
        if (columnId === 'to-do') {
            task.status = 'to-do';
        } else if (columnId === 'in-progress') {
            task.status = 'in-progress';
        } else if (columnId === 'completed') {
            task.status = 'completed';
        }
        tasks.forEach((t, index) => {
            if (t.name === task.name && t.description === task.description) {
                tasks[index] = task;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    });
});

renderTasks();