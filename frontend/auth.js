// ===== AUTHENTICATION CHECK & USER MANAGEMENT (dùng chung cho mọi trang) =====

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

/**
 * Tìm link "Đăng Nhập / Đăng Ký" trong navbar và thay bằng:
 * - Nếu CHƯA đăng nhập: giữ nguyên link "Đăng Nhập / Đăng Ký" -> auth.html
 * - Nếu ĐÃ đăng nhập: đổi thành "👤 Tên" -> tai_khoan.html
 */
function updateNavAuthLink() {
  const navLinks = document.querySelector('#navbar .nav-links');
  if (!navLinks) return;

  // Tìm thẻ <a> trỏ tới auth.html trong navbar
  const authLink = navLinks.querySelector('a[href="auth.html"]');
  const user = getCurrentUser();

  if (!authLink) return;

  if (user) {
    // Đã đăng nhập -> đổi link thành Tài Khoản
    authLink.textContent = `👤 ${user.name}`;
    authLink.setAttribute('href', 'tai_khoan.html');
    authLink.style.color = 'var(--gold)';
  } else {
    // Chưa đăng nhập -> giữ nguyên
    authLink.textContent = 'Đăng Nhập / Đăng Ký';
    authLink.setAttribute('href', 'auth.html');
  }
}

/**
 * Auto-fill user info vào form đặt tour (nếu trang có các input này)
 */
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

// Chạy trên mọi trang có nhúng auth.js
document.addEventListener('DOMContentLoaded', function () {
  updateNavAuthLink();
  setUserInfoInForm();
});