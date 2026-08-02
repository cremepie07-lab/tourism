document.addEventListener('DOMContentLoaded', initializeAuth);

function initializeAuth() {
  const user = localStorage.getItem('user');
  if (user) {
    window.location.href = 'tai_khoan.html';
    return;
  }

  const tabs = document.querySelectorAll('.auth-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
  });

  const switchLinks = document.querySelectorAll('.switch-tab');
  switchLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.tab);
    });
  });

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
}

function switchTab(tabName) {
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(form => form.classList.remove('active'));

  const tabs = document.querySelectorAll('.auth-tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  const form = document.querySelector(`[data-form="${tabName}"]`);
  if (form) form.classList.add('active');

  const tab = document.querySelector(`[data-tab="${tabName}"]`);
  if (tab) tab.classList.add('active');

  clearMessages();
}

function showMessage(messageId, type, text) {
  const messageEl = document.getElementById(messageId);
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = `form-message show ${type}`;
}

function clearMessages() {
  const messages = document.querySelectorAll('.form-message');
  messages.forEach(msg => {
    msg.classList.remove('show');
    msg.textContent = '';
  });
}

async function handleLogin(e) {
  e.preventDefault();
  clearMessages();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const button = e.target.querySelector('button');

  if (!email || !password) {
    showMessage('loginMessage', 'error', '❌ Vui lòng điền tất cả thông tin');
    return;
  }

  setButtonLoading(button, true);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('user', JSON.stringify(result.user));
      showMessage('loginMessage', 'success', '✅ ' + result.message);

      setTimeout(() => {
        window.location.href = 'tai_khoan.html';
      }, 1000);
    } else {
      showMessage('loginMessage', 'error', '❌ ' + result.error);
    }
  } catch (err) {
    console.error('Login error:', err);
    showMessage('loginMessage', 'error', '❌ Lỗi kết nối server');
  } finally {
    setButtonLoading(button, false);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  clearMessages();

  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirm').value;
  const button = e.target.querySelector('button');

  if (!name || !email || !phone || !password || !confirmPassword) {
    showMessage('registerMessage', 'error', '❌ Vui lòng điền tất cả thông tin');
    return;
  }
  if (password.length < 6) {
    showMessage('registerMessage', 'error', '❌ Mật khẩu phải ít nhất 6 ký tự');
    return;
  }
  if (password !== confirmPassword) {
    showMessage('registerMessage', 'error', '❌ Mật khẩu không khớp');
    return;
  }
  if (!isValidEmail(email)) {
    showMessage('registerMessage', 'error', '❌ Email không hợp lệ');
    return;
  }
  if (!isValidPhone(phone)) {
    showMessage('registerMessage', 'error', '❌ Số điện thoại không hợp lệ');
    return;
  }

  setButtonLoading(button, true);

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, confirmPassword })
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('user', JSON.stringify(result.user));
      showMessage('registerMessage', 'success', '✅ ' + result.message);

      setTimeout(() => {
        window.location.href = 'tai_khoan.html';
      }, 1000);
    } else {
      showMessage('registerMessage', 'error', '❌ ' + result.error);
    }
  } catch (err) {
    console.error('Register error:', err);
    showMessage('registerMessage', 'error', '❌ Lỗi kết nối server');
  } finally {
    setButtonLoading(button, false);
  }
}

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}
