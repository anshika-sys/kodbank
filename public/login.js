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
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isError ? 'rgba(255, 107, 107, 0.95)' : 'rgba(76, 175, 80, 0.95)'};
    color: white;
    padding: 15px 25px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 2000;
    animation: slideIn 0.5s ease;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    max-width: 350px;
  `;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => messageDiv.remove(), 500);
  }, 4000);
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    showMessage('Please fill in all fields!', true);
    return;
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
        window.location.href = '/dashboard.html';
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

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);
