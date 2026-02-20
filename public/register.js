function togglePassword(inputId) {
  const input = document.getElementById(inputId);
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

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const uid = document.getElementById('uid').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const balance = document.getElementById('balance').value;

  if (!uid || !username || !email || !password || !role) {
    showMessage('Please fill in all required fields!', true);
    return;
  }

  if (password.length < 8) {
    showMessage('Password must be at least 8 characters!', true);
    return;
  }

  showLoader('registerBtn');

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, username, email, phone, password, role, balance })
    });

    const data = await response.json();

    if (data.success) {
      hideLoader('registerBtn');
      showMessage('✨ Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login-pro.html';
      }, 1500);
    } else {
      hideLoader('registerBtn');
      showMessage(data.message || 'Registration failed!', true);
    }
  } catch (error) {
    hideLoader('registerBtn');
    showMessage('Network error. Please try again!', true);
    console.error('Registration error:', error);
  }
});
