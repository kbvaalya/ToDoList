const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

const generateBtn = document.getElementById('generate-btn');
const exerciseDisplay = document.getElementById('exercise-display');

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadLastExercise();
});

function saveTasks() {
    const tasks = [];

    taskList.querySelectorAll('li').forEach(li => {
        const text = li.querySelector('span').textContent;
        const completed = li.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text, completed });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];

    taskList.innerHTML = '';

    saved.forEach(task => createTaskElement(task.text, task.completed));
}


function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    createTaskElement(text, false);
    saveTasks();

    taskInput.value = '';
}

function createTaskElement(text, completed) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;

    const span = document.createElement('span');
    span.textContent = text;

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';

    if (completed) {
        span.style.textDecoration = 'line-through';
    }

    checkbox.addEventListener('change', () => {
        span.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        saveTasks();
    });

    delBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});


function saveLastExercise(html) {
    localStorage.setItem('lastExercise', html);
}

function loadLastExercise() {
    const saved = localStorage.getItem('lastExercise');
    if (saved) {
        exerciseDisplay.innerHTML = saved; 
    }
}


async function generateExercise() {
    generateBtn.disabled = true;
    exerciseDisplay.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const response = await fetch(
            'https://api.api-ninjas.com/v1/exercises?muscle=biceps',
            {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'yMp+yeIeXs32fNeHR5MO2w==5wZ2SMuwFzNMnFqO'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Error API: ' + response.status);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const exercise = data[randomIndex];

            const html = `
                <div class="exercise-name">${exercise.name}</div>
                <div class="exercise-info">
                    <strong>Type:</strong> ${exercise.type}<br>
                    <strong>Muscle:</strong> ${exercise.muscle}<br>
                    <strong>Difficulty:</strong> ${exercise.difficulty}<br><br>
                    <strong>Instructions:</strong><br>
                    ${exercise.instructions || 'No instructions available'}
                </div>
            `;

            exerciseDisplay.innerHTML = html;
            saveLastExercise(html); 
        } else {
            generateExerciseAlternative();
        }
    } catch (error) {
        console.error('Error:', error);
        generateExerciseAlternative();
    } finally {
        generateBtn.disabled = false;
    }
}

function generateExerciseAlternative() {
    const html = `
        <div class="exercise-name">Failed to load exercise</div>
        <div class="exercise-info">
            API is unavailable now.<br><br>
            Try this exercise instead:<br>
            <strong>3 sets of 10–12 push-ups</strong><br><br>
            Or press "Generate" again later.
        </div>
    `;
    exerciseDisplay.innerHTML = html;
    saveLastExercise(html); 
}

generateBtn.addEventListener('click', generateExercise);
