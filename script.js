const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    if (taskList.querySelector('.empty-state')) {
        taskList.innerHTML = '';
    }

    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const span = document.createElement('span');
    span.textContent = text;

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';

    checkbox.addEventListener('change', () => {
        span.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    });

    delBtn.addEventListener('click', () => {
        li.remove();
        if (taskList.children.length === 0) {
            taskList.innerHTML = '<div class="empty-state">No tasks. Add one!</div>';
        }
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);

    taskInput.value = '';
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

const generateBtn = document.getElementById('generate-btn');
const exerciseDisplay = document.getElementById('exercise-display');

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

            exerciseDisplay.innerHTML = `
                <div class="exercise-name">${exercise.name}</div>
                <div class="exercise-info">
                    <strong>Type:</strong> ${exercise.type}<br>
                    <strong>muscle:</strong> ${exercise.muscle}<br>
                    <strong>difficulty:</strong> ${exercise.difficulty}<br><br>
                    <strong>offset:</strong><br>
                    ${exercise.instructions || 'Инструкции отсутствуют'}
                </div>
            `;
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
    exerciseDisplay.innerHTML = `
        <div class="exercise-name">Не удалось загрузить упражнение</div>
        <div class="exercise-info">
            Похоже, что API сейчас недоступен или вернул пустой ответ.<br><br>
            Попробуй, например, это упражнение:<br>
            <strong>3 подхода по 10–12 подтягиваний / отжиманий</strong><br><br>
            Или нажми "Сгенерировать" ещё раз чуть позже.
        </div>
    `;
}

generateBtn.addEventListener('click', generateExercise);
