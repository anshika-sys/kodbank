let userData = null;

// Initialize dashboard
async function init() {
  try {
    const response = await fetch('/api/balance', {
      credentials: 'include'
    });

    if (!response.ok) {
      window.location.href = '/login-pro.html';
      return;
    }

    const data = await response.json();
    if (data.success) {
      userData = data;
      updateUserInfo();
      updateStats();
      initializeCharts();
      loadTransactions();
    }
  } catch (error) {
    console.error('Init error:', error);
    window.location.href = '/login-pro.html';
  }
}

// Update user information
function updateUserInfo() {
  document.getElementById('userName').textContent = userData.username;
  document.getElementById('userRole').textContent = userData.role;
  document.getElementById('topUserName').textContent = userData.username;
  document.getElementById('balanceUserName').textContent = userData.username;
  
  // Update avatar with initials
  const initials = userData.username.substring(0, 2).toUpperCase();
  document.getElementById('userAvatar').textContent = initials;
  
  // Update top avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${userData.username}&background=3498db&color=fff`;
  document.getElementById('topUserAvatar').src = avatarUrl;
  
  // Show banker welcome message
  setTimeout(() => {
    const bubble = document.getElementById('bankerBubble');
    const message = document.getElementById('bankerMessage');
    message.textContent = `Hello ${userData.username}! 💕 Welcome to KodNest Secure Bank. Click the button to check your balance!`;
    bubble.style.display = 'block';
  }, 500);
}

// Check Balance Function
function checkBalance() {
  const balanceDisplay = document.getElementById('balanceDisplay');
  const balanceAmount = document.getElementById('balanceAmount');
  const balanceMessage = document.getElementById('balanceMessage');
  const bankerBubble = document.getElementById('bankerBubble');
  const bankerMessage = document.getElementById('bankerMessage');
  const bankerAnimation = document.getElementById('bankerAnimation');
  
  // Show balance
  const balance = parseFloat(userData.balance);
  balanceAmount.textContent = `₹${balance.toLocaleString('en-IN')}`;
  balanceDisplay.style.display = 'block';
  
  // Animate banker
  bankerAnimation.classList.add('celebrate');
  
  // Update banker message
  bankerMessage.textContent = `Yayyy! 🎉 Your balance is ₹${balance.toLocaleString('en-IN')}! Your money is safe with us 💙`;
  
  // Speak the balance
  speakBalance(balance);
  
  // Show confetti
  createConfetti();
  
  // Remove celebration animation after 2 seconds
  setTimeout(() => {
    bankerAnimation.classList.remove('celebrate');
  }, 2000);
}

// Text-to-Speech Function
function speakBalance(balance) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(
      `Yayyy! Your balance is ${balance.toLocaleString('en-IN')} rupees! Your money is safe with us.`
    );
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
}

// Confetti Animation
function createConfetti() {
  const colors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 4000);
  }
}

// Update statistics
function updateStats() {
  const balance = parseFloat(userData.balance);
  document.getElementById('totalBalance').textContent = `₹${balance.toLocaleString('en-IN')}`;
  document.getElementById('totalTransactions').textContent = '36';
  document.getElementById('totalDeposits').textContent = `₹${(balance * 0.3).toLocaleString('en-IN')}`;
  document.getElementById('totalWithdrawals').textContent = `₹${(balance * 0.1).toLocaleString('en-IN')}`;
}

// Initialize charts
function initializeCharts() {
  // Monthly Activity Chart
  const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
  new Chart(monthlyCtx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Deposits',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 32000, 29000, 35000, 31000, 38000],
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        borderRadius: 8,
        barThickness: 20
      }, {
        label: 'Withdrawals',
        data: [8000, 12000, 10000, 15000, 13000, 18000, 16000, 20000, 17000, 22000, 19000, 24000],
        backgroundColor: 'rgba(231, 76, 60, 0.8)',
        borderRadius: 8,
        barThickness: 20
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2.5,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      }
    }
  });

  // Distribution Chart
  const distributionCtx = document.getElementById('distributionChart').getContext('2d');
  new Chart(distributionCtx, {
    type: 'doughnut',
    data: {
      labels: ['Deposits', 'Withdrawals', 'Transfers'],
      datasets: [{
        data: [45, 30, 25],
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)',
          'rgba(231, 76, 60, 0.8)',
          'rgba(241, 196, 15, 0.8)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 10,
            font: {
              size: 11
            }
          }
        }
      }
    }
  });
}

// Load transactions
function loadTransactions() {
  const allTransactions = document.getElementById('allTransactions');
  if (allTransactions) {
    allTransactions.innerHTML = `
      <div class="transaction-item">
        <div class="transaction-icon deposit">📥</div>
        <div class="transaction-details">
          <div class="transaction-title">Salary Deposit</div>
          <div class="transaction-date">Today, 10:30 AM</div>
        </div>
        <div class="transaction-amount positive">+₹50,000</div>
      </div>
      <div class="transaction-item">
        <div class="transaction-icon withdrawal">📤</div>
        <div class="transaction-details">
          <div class="transaction-title">ATM Withdrawal</div>
          <div class="transaction-date">Yesterday, 3:45 PM</div>
        </div>
        <div class="transaction-amount negative">-₹5,000</div>
      </div>
      <div class="transaction-item">
        <div class="transaction-icon transfer">💸</div>
        <div class="transaction-details">
          <div class="transaction-title">Transfer to John</div>
          <div class="transaction-date">2 days ago</div>
        </div>
        <div class="transaction-amount negative">-₹10,000</div>
      </div>
      <div class="transaction-item">
        <div class="transaction-icon deposit">📥</div>
        <div class="transaction-details">
          <div class="transaction-title">Refund from Amazon</div>
          <div class="transaction-date">3 days ago</div>
        </div>
        <div class="transaction-amount positive">+₹2,500</div>
      </div>
      <div class="transaction-item">
        <div class="transaction-icon withdrawal">📤</div>
        <div class="transaction-details">
          <div class="transaction-title">Bill Payment</div>
          <div class="transaction-date">5 days ago</div>
        </div>
        <div class="transaction-amount negative">-₹3,200</div>
      </div>
    `;
  }
}

// Navigation
document.querySelectorAll('.nav-item[data-section]').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.dataset.section;
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    // Update active section
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
    
    // Update page title
    const titles = {
      'analytics': 'Analytics',
      'transfer': 'Transfer Money',
      'deposit': 'Deposit Money',
      'transactions': 'All Transactions',
      'customers': 'Customers',
      'settings': 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section];
  });
});

// Transfer form
document.getElementById('transferForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Transfer functionality coming soon!');
});

// Deposit form
document.getElementById('depositForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Deposit functionality coming soon!');
});

// Logout
async function logout() {
  try {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/login-pro.html';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/login-pro.html';
  }
}

// Initialize on load
init();
