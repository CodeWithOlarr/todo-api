// API URL
const API_URL = 'http://localhost:7000/api';

// Helper functions
function getToken() {
    return localStorage.getItem('token');
}

function saveToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function isLoggedIn() {
    return getToken() !== null;
}

// ========== REGISTER ==========
if (document.getElementById('registerForm')) {
    const form = document.getElementById('registerForm');
    const messageEl = document.getElementById('message');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                saveToken(data.token);
                saveUser(data.user);
                messageEl.style.color = '#48bb78';
                messageEl.textContent = 'Account created! Redirecting...';
                setTimeout(() => {
                    window.location.href = '/todos.html';
                }, 1000);
            } else {
                messageEl.style.color = '#e53e3e';
                messageEl.textContent = data.message;
            }
        } catch (error) {
            messageEl.style.color = '#e53e3e';
            messageEl.textContent = 'Connection error';
        }
    });
}

// ========== LOGIN ==========
if (document.getElementById('loginForm')) {
    const form = document.getElementById('loginForm');
    const messageEl = document.getElementById('message');
    
    if (isLoggedIn()) {
        window.location.href = '/todos.html';
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                saveToken(data.token);
                saveUser(data.user);
                messageEl.style.color = '#48bb78';
                messageEl.textContent = 'Welcome back! Redirecting...';
                setTimeout(() => {
                    window.location.href = '/todos.html';
                }, 1000);
            } else {
                messageEl.style.color = '#e53e3e';
                messageEl.textContent = data.message;
            }
        } catch (error) {
            messageEl.style.color = '#e53e3e';
            messageEl.textContent = 'Connection error';
        }
    });
}

// ========== TODOS ==========
if (document.getElementById('todoList')) {
    if (!isLoggedIn()) {
        window.location.href = '/index.html';
    }
    
    const user = getUser();
    if (user) {
        document.getElementById('userGreeting').textContent = `Hello, ${user.name.split(' ')[0]}!`;
    }
    
    let currentEditId = null;
    
    async function loadTodos() {
        try {
            const response = await fetch(`${API_URL}/todos`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            
            if (response.status === 401) {
                removeToken();
                window.location.href = '/index.html';
                return;
            }
            
            const todos = await response.json();
            updateStats(todos);
            displayTodos(todos);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    function updateStats(todos) {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const statsText = document.getElementById('taskStats');
        if (statsText) {
            statsText.textContent = `${completed}/${total} tasks completed`;
        }
    }
    
    function displayTodos(todos) {
        const container = document.getElementById('todoList');
        
        if (todos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <p>No tasks yet. Add your first task above!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = todos.map(todo => `
            <div class="task-item" data-id="${todo._id}">
                <div class="task-checkbox">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete('${todo._id}', this.checked)">
                </div>
                <div class="task-content">
                    <div class="task-title ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.title)}</div>
                    ${todo.description ? `<div class="task-description">${escapeHtml(todo.description)}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="edit-task" onclick="openEditModal('${todo._id}', '${escapeHtml(todo.title)}', '${escapeHtml(todo.description || '')}')">Edit</button>
                    <button class="delete-task" onclick="deleteTodo('${todo._id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    window.toggleComplete = async function(id, completed) {
        try {
            await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ completed })
            });
            loadTodos();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    window.openEditModal = function(id, title, description) {
        currentEditId = id;
        document.getElementById('editTitle').value = title;
        document.getElementById('editDescription').value = description;
        document.getElementById('editModal').style.display = 'block';
    };
    
    async function saveEdit() {
        const title = document.getElementById('editTitle').value;
        const description = document.getElementById('editDescription').value;
        
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/todos/${currentEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ title, description })
            });
            
            if (response.ok) {
                closeModal();
                loadTodos();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    window.deleteTodo = async function(id) {
        if (confirm('Delete this task?')) {
            try {
                await fetch(`${API_URL}/todos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                loadTodos();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    
    async function addTodo() {
        const title = document.getElementById('todoTitle').value;
        
        if (!title.trim()) {
            alert('Please enter a task');
            return;
        }
        
        try {
            await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ title, description: '', completed: false })
            });
            document.getElementById('todoTitle').value = '';
            loadTodos();
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    function closeModal() {
        document.getElementById('editModal').style.display = 'none';
        currentEditId = null;
    }
    
    // Event listeners
    document.getElementById('addBtn').addEventListener('click', addTodo);
    document.getElementById('todoTitle').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    document.getElementById('logoutBtn').addEventListener('click', () => {
        removeToken();
        window.location.href = '/index.html';
    });
    document.getElementById('saveEditBtn').addEventListener('click', saveEdit);
    document.getElementById('cancelEditBtn').addEventListener('click', closeModal);
    
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.onclick = (event) => {
        const modal = document.getElementById('editModal');
        if (event.target === modal) {
            closeModal();
        }
    };
    
    loadTodos();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}