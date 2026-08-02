function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function logout() {
  if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('user');
    window.location.reload();
  }
}

function updateNavAuthLink() {
  const navLinks = document.querySelector('#navbar .nav-links');
  if (!navLinks) return;

  const authLink = navLinks.querySelector('a[href="auth.html"]');
  const user = getCurrentUser();

  if (!authLink) return;

  if (user) {

    authLink.textContent = `👤 ${user.name}`;
    authLink.setAttribute('href', 'tai_khoan.html');
    authLink.style.color = 'var(--gold)';
  } else {

    authLink.textContent = 'Đăng Nhập / Đăng Ký';
    authLink.setAttribute('href', 'auth.html');
  }
}

function setUserInfoInForm() {
  const user = getCurrentUser();
  if (!user) return;

  const nameInput = document.getElementById('cusName');
  const phoneInput = document.getElementById('cusPhone');
  const emailInput = document.getElementById('cusEmail');

  if (nameInput && !nameInput.value) nameInput.value = user.name;
  if (phoneInput && !phoneInput.value) phoneInput.value = user.phone;
  if (emailInput && !emailInput.value) emailInput.value = user.email;
}

document.addEventListener('DOMContentLoaded', function () {
  updateNavAuthLink();
  setUserInfoInForm();
});
