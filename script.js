// DOM Elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [
    { id: 1, text: 'Design the hero section', completed: true },
    { id: 2, text: 'Implement glassmorphism UI', completed: true },
    { id: 3, text: 'Build interactive to-do list', completed: false },
    { id: 4, text: 'Optimize for mobile devices', completed: false }
];
let currentFilter = 'all';

// Initialize
function init() {
    renderTodos();
    updateTaskCount();
}

// Event Listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

todoList.addEventListener('click', (e) => {
    const item = e.target.closest('.todo-item');
    if (!item) return;
    
    const id = Number(item.dataset.id);
    
    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        deleteTodo(id);
    } else if (e.target.classList.contains('todo-checkbox')) {
        toggleTodo(id);
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update current filter
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
});

// Functions
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    const newTodo = {
        id: Date.now(),
        text,
        completed: false
    };
    
    todos.unshift(newTodo); // Add to beginning
    todoInput.value = '';
    
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    // Add fade out animation logic here if desired before removal
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.style.transform = 'translateX(20px)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }, 300);
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateTaskCount();
}

function updateTaskCount() {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}

function renderTodos() {
    todoList.innerHTML = '';
    
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <li style="text-align: center; color: var(--text-secondary); padding: 1rem;">
                No tasks found.
            </li>
        `;
        return;
    }
    
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn" aria-label="Delete task">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        
        todoList.appendChild(li);
    });
}

// Start app
init();

// Simple smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
