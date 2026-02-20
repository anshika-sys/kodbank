function togglePassword() {
  const input = document.getElementById('password');
  const button = input.nextElementSibling;
  
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁️';
  }
}

function showLoader(buttonId) {
  const button = document.getElementById(buttonId);
  button.querySelector('.btn-text').style.display = 'none';
  button.querySelector('.loader').style.display = 'block';
  button.disabled = true;
}

function hideLoader(buttonId) {
  const button = document.getElementById(buttonId);
  button.querySelector('.btn-text').style.display = 'block';
  button.querySelector('.loader').style.display = 'none';
  button.disabled = false;
}

function showMessage(message, isError = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-toast ${isError ? 'error' : 'success'}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => messageDiv.remove(), 500);
  }, 3000);
}

// Load remembered username
window.addEventListener('DOMContentLoaded', () => {
  const rememberedUsername = localStorage.getItem('rememberedUsername');
  if (rememberedUsername) {
    document.getElementById('username').value = rememberedUsername;
    document.getElementById('remember').checked = true;
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;

  if (!username || !password) {
    showMessage('Please fill in all fields!', true);
    return;
  }

  // Save username if remember is checked
  if (remember) {
    localStorage.setItem('rememberedUsername', username);
  } else {
    localStorage.removeItem('rememberedUsername');
  }

  showLoader('loginBtn');

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      hideLoader('loginBtn');
      showMessage('✨ Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard-pro.html';
      }, 1500);
    } else {
      hideLoader('loginBtn');
      showMessage(data.message || 'Login failed!', true);
    }
  } catch (error) {
    hideLoader('loginBtn');
    showMessage('Network error. Please try again!', true);
    console.error('Login error:', error);
  }
});
