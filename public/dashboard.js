let userData = null;
let hasCheckedBalance = false;

async function init() {
  try {
    const response = await fetch('/api/balance', {
      credentials: 'include'
    });

    if (!response.ok) {
      window.location.href = '/login.html';
      return;
    }

    const data = await response.json();
    if (data.success) {
      userData = data;
      showWelcomeMessage();
    }
  } catch (error) {
    console.error('Init error:', error);
    window.location.href = '/login.html';
  }
}

function showWelcomeMessage() {
  document.getElementById('welcomeMessage').textContent = `Welcome ${userData.username}! 👋`;
  document.getElementById('roleMessage').textContent = `You are logged in as a ${userData.role}`;
  
  speakMessage(`Hello ${userData.username}! 💕 Welcome back to KodNest Secure Bank. You are logged in as a ${userData.role}. I'm here to help you! Please check your balance 💰`);
}

function speakMessage(message) {
  document.getElementById('bankerMessage').textContent = message;
  
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  }
}

async function checkBalance() {
  if (hasCheckedBalance) {
    // Show balance screen again
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('balanceScreen').classList.remove('hidden');
    return;
  }

  try {
    const response = await fetch('/api/balance', {
      credentials: 'include'
    });

    const data = await response.json();

    if (data.success) {
      hasCheckedBalance = true;
      
      // Hide welcome screen, show balance screen
      document.getElementById('welcomeScreen').classList.add('hidden');
      document.getElementById('balanceScreen').classList.remove('hidden');
      
      showBalanceWithCelebration(data.balance);
    }
  } catch (error) {
    console.error('Balance check error:', error);
  }
}

function goBack() {
  document.getElementById('balanceScreen').classList.add('hidden');
  document.getElementById('welcomeScreen').classList.remove('hidden');
}

function showBalanceWithCelebration(balance) {
  // Show confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
  }, 250);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }, 400);

  // Show balance
  const formattedBalance = parseFloat(balance).toLocaleString('en-IN');
  document.getElementById('balanceAmount').textContent = `₹${formattedBalance}`;

  // Convert number to words for Indian currency
  const balanceInWords = numberToIndianWords(balance);
  const balanceMessage = `Yayyy! Your current balance is ${balanceInWords} rupees!`;
  document.getElementById('bankerMessage').textContent = balanceMessage;
  
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(balanceMessage);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    utterance.lang = 'en-IN';
    speechSynthesis.speak(utterance);
  }

  // Play celebration sound
  playSound();
}

function numberToIndianWords(num) {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  if (num === 0) return 'zero';
  
  let words = '';
  
  // Lakhs
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    words += numberToIndianWords(lakhs) + ' lakh ';
    num %= 100000;
  }
  
  // Thousands
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    words += numberToIndianWords(thousands) + ' thousand ';
    num %= 1000;
  }
  
  // Hundreds
  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' hundred ';
    num %= 100;
  }
  
  // Tens and ones
  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  } else if (num >= 10) {
    words += teens[num - 10] + ' ';
    return words.trim();
  }
  
  if (num > 0) {
    words += ones[num] + ' ';
  }
  
  return words.trim();
}

function playSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

async function logout() {
  try {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/login.html';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/login.html';
  }
}

init();
