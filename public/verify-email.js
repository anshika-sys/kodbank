async function verifyEmail() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    showStatus('❌ No verification token found', 'Please check your email for the verification link.', true);
    return;
  }

  try {
    const response = await fetch(`/api/verify-email?token=${token}`);
    const data = await response.json();

    if (data.success) {
      showStatus('✅ Email Verified Successfully!', data.message, false);
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 2000);
    } else {
      showStatus('❌ Verification Failed', data.message, true);
    }
  } catch (error) {
    showStatus('❌ Error', 'Network error. Please try again!', true);
    console.error('Verification error:', error);
  }
}

function showStatus(title, message, isError) {
  const statusDiv = document.getElementById('verificationStatus');
  statusDiv.innerHTML = `
    <div style="font-size: 60px; margin-bottom: 20px;">
      ${isError ? '❌' : '✅'}
    </div>
    <h2 style="color: white; margin-bottom: 10px;">${title}</h2>
    <p style="color: rgba(255, 255, 255, 0.9);">${message}</p>
  `;
}

verifyEmail();
