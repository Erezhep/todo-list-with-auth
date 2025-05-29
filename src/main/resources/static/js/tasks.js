let tasks = /*[[${tasks}]]*/ [];
    let selectedDate = null;
    let currentDate = new Date();

    const calendar = document.getElementById('calendar');
    const taskList = document.getElementById('taskList');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const monthYearDisplay = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const filterButtons = {
        all: document.getElementById('filterAll'),
        today: document.getElementById('filterToday')
    };

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function renderCalendar(date) {
        calendar.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();
        monthYearDisplay.textContent = date.toLocaleString('ru', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        weekdays.forEach(day => {
            const header = document.createElement('div');
            header.textContent = day;
            header.style.fontWeight = '500';
            header.style.textAlign = 'center';
            header.style.color = '#5f6368';
            header.style.padding = '0.75rem';
            header.style.fontSize = '0.9rem';
            calendar.appendChild(header);
        });

        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            calendar.appendChild(emptyCell);
        }

        for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');
            dayDiv.textContent = dayNum;

            const fullDate = new Date(year, month, dayNum);
            const fullDateString = formatDate(fullDate);

            const tasksForDay = tasks.filter(t => t.dueDate === fullDateString);
            if (tasksForDay.length > 0) {
                const countBadge = document.createElement('div');
                countBadge.className = 'task-count';
                countBadge.textContent = tasksForDay.length;
                dayDiv.appendChild(countBadge);
            }

            if (selectedDate === fullDateString) {
                dayDiv.classList.add('selected');
            }

            dayDiv.addEventListener('click', () => {
                selectedDate = fullDateString;
                renderCalendar(date);
                fetchTasksForDate(fullDateString);
            });

            calendar.appendChild(dayDiv);
        }
    }

    function fetchTasksForDate(date) {
        const csrfToken = document.querySelector('meta[name="_csrf"]').content;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;
        fetch(`/tasks/by-date?dueDate=${date}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            renderTasks(data);
        })
        .catch(error => {
            console.error('Ошибка при получении задач:', error);
            renderTasks([]);
        });
    }

    function renderTasks(tasksToRender) {
        taskList.innerHTML = '';
        if (!selectedDate) {
            selectedDateDisplay.textContent = 'Выберите дату';
            return;
        }
        selectedDateDisplay.textContent = new Date(selectedDate).toLocaleDateString('ru', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        if (tasksToRender.length === 0) {
            const noTaskItem = document.createElement('li');
            noTaskItem.className = 'task-item list-group-item';
            noTaskItem.innerHTML = `
                <div class="task-content text-center">
                    <span class="task-title">Нет задач на этот день.</span>
                </div>
            `;
            taskList.appendChild(noTaskItem);
            return;
        }

        tasksToRender.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item list-group-item';
            li.innerHTML = `
                <div class="task-content">
                    <span class="task-title ${task.completed ? 'task-completed' : ''}">${task.title}</span>
                    ${task.description ? `<span class="task-description ${task.completed ? 'task-completed' : ''}">${task.description}</span>` : ''}
                    <span class="task-due-date">Срок: ${task.dueDate}</span>
                </div>
                <div class="task-buttons">
                    ${!task.completed ? `
                        <button class="btn btn-success btn-sm" onclick="markTaskComplete(${task.id})">
                            <span class="material-icons" style="font-size: 1rem;">check</span>
                        </button>
                    ` : ''}
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                        <span class="material-icons" style="font-size: 1rem;">delete</span>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function markTaskComplete(taskId) {
        const csrfToken = document.querySelector('meta[name="_csrf"]').content;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;
        fetch(`/tasks/complete/${taskId}`, {
            method: 'POST',
            headers: {
                [csrfHeader]: csrfToken
            }
        })
        .then(() => {
            if (selectedDate) {
                fetchTasksForDate(selectedDate);
            } else {
                fetchAllTasks();
            }
            renderCalendar(currentDate);
        })
        .catch(error => console.error('Ошибка при завершении задачи:', error));
    }

    function deleteTask(taskId) {
        const csrfToken = document.querySelector('meta[name="_csrf"]').content;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;
        fetch(`/tasks/delete/${taskId}`, {
            method: 'POST',
            headers: {
                [csrfHeader]: csrfToken
            }
        })
        .then(() => {
            if (selectedDate) {
                fetchTasksForDate(selectedDate);
            } else {
                fetchAllTasks();
            }
            renderCalendar(currentDate);
        })
        .catch(error => console.error('Ошибка при удалении задачи:', error));
    }

    function fetchAllTasks() {
        const csrfToken = document.querySelector('meta[name="_csrf"]').content;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;
        fetch('/tasks/all', {
            method: 'GET',
            headers: {
                [csrfHeader]: csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            tasks = data;
            renderAllTasksList();
            renderCalendar(currentDate);
        })
        .catch(error => console.error('Ошибка при получении всех задач:', error));
    }

    function renderAllTasksList() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            const noTaskItem = document.createElement('li');
            noTaskItem.className = 'task-item list-group-item';
            noTaskItem.innerHTML = `
                <div class="task-content text-center">
                    <span class="task-title">Нет доступных задач.</span>
                </div>
            `;
            taskList.appendChild(noTaskItem);
            return;
        }
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item list-group-item';
            li.innerHTML = `
                <div class="task-content">
                    <span class="task-title ${task.completed ? 'task-completed' : ''}">${task.title}</span>
                    ${task.description ? `<span class="task-description ${task.completed ? 'task-completed' : ''}">${task.description}</span>` : ''}
                    <span class="task-due-date">Срок: ${task.dueDate}</span>
                </div>
                <div class="task-buttons">
                    ${!task.completed ? `
                        <button class="btn btn-success btn-sm" onclick="markTaskComplete(${task.id})">
                            <span class="material-icons" style="font-size: 1rem;">check</span>
                        </button>
                    ` : ''}
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                        <span class="material-icons" style="font-size: 1rem;">delete</span>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    filterButtons.all.onclick = () => {
        filterButtons.all.classList.add('active');
        filterButtons.today.classList.remove('active');
        selectedDate = null;
        taskList.innerHTML = '';
        selectedDateDisplay.textContent = 'Все задачи';
        fetchAllTasks();
    };

    filterButtons.today.onclick = () => {
        filterButtons.today.classList.add('active');
        filterButtons.all.classList.remove('active');
        selectedDate = formatDate(new Date());
        renderCalendar(currentDate);
        fetchTasksForDate(selectedDate);
    };

    prevMonthBtn.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
        if (selectedDate) fetchTasksForDate(selectedDate);
    };

    nextMonthBtn.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
        if (selectedDate) fetchTasksForDate(selectedDate);
    };

    function init() {
        renderCalendar(currentDate);
        filterButtons.all.click();
    }

    init();