// ===== TRANG TÀI KHOẢN KHÁCH HÀNG =====

document.addEventListener('DOMContentLoaded', function () {
  const userStr = localStorage.getItem('user');

  // Chưa đăng nhập -> đá về trang auth
  if (!userStr) {
    window.location.href = 'auth.html';
    return;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    // Dữ liệu localStorage bị hỏng/không parse được -> xóa và đá về auth
    console.error('❌ Dữ liệu user trong localStorage bị lỗi:', e);
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
    return;
  }

  // Kiểm tra dữ liệu user có đủ thông tin cần thiết không
  if (!user || !user.name || !user.email || !user.id) {
    console.error('❌ Dữ liệu user không hợp lệ (thiếu id/name/email):', user);
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
    return;
  }

  // Hiển thị thông tin cá nhân
  document.getElementById('welcomeName').textContent = `Xin chào, ${user.name}!`;
  document.getElementById('welcomeSub').textContent = user.email;
  document.getElementById('avatarInitial').textContent = user.name.charAt(0).toUpperCase();

  document.getElementById('infoName').textContent = user.name;
  document.getElementById('infoEmail').textContent = user.email;
  document.getElementById('infoPhone').textContent = user.phone || '-';

  // Load lịch sử đặt tour
  loadBookingHistory(user.id);
});

async function loadBookingHistory(userId) {
  const container = document.getElementById('bookingsList');

  try {
    const response = await fetch(`/api/users/${userId}/bookings`);

    if (!response.ok) {
      throw new Error(`Server trả về lỗi ${response.status}`);
    }

    const bookings = await response.json();

    if (!bookings || bookings.length === 0) {
      container.innerHTML = `
        <div class="empty-bookings">
          <p>Bạn chưa đặt tour nào.</p>
          <a href="dat_tour.html">Khám phá tour ngay →</a>
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map(b => `
      <div class="booking-item">
        <img src="${b.image || ''}" alt="${b.tour_name || ''}" onerror="this.style.display='none'">
        <div class="booking-item-info">
          <div class="booking-item-title">${b.tour_name || 'Tour'}</div>
          <div class="booking-item-meta">
            📍 ${b.location || ''} &nbsp;•&nbsp; 📅 Khởi hành: ${formatDate(b.departure_date || b.date)} &nbsp;•&nbsp; 👥 ${formatPaxSummary(b)}
          </div>
          <div class="booking-item-date">🕒 Đặt lúc: ${formatDateTime(b.created_at)}</div>
        </div>
        <div class="booking-item-price">${Number(b.total_price || 0).toLocaleString('vi-VN')}đ</div>
      </div>
    `).join('');

  } catch (err) {
    console.error('❌ Error loading bookings:', err);
    container.innerHTML = '<p class="loading-text">Không thể tải lịch sử đặt tour. Vui lòng kiểm tra backend đang chạy.</p>';
  }
}

// Ghép chuỗi tóm tắt số lượng khách kèm khoảng tuổi rõ ràng:
// "2 người lớn (>11 tuổi), 1 trẻ em (5-11 tuổi)" (chỉ hiện mục có số lượng > 0)
function formatPaxSummary(b) {
  const adults = Number(b.adults ?? 1);
  const children = Number(b.children ?? 0);
  const infants = Number(b.infants ?? 0);

  const parts = [];
  if (adults > 0) parts.push(`${adults} người lớn (>11 tuổi)`);
  if (children > 0) parts.push(`${children} trẻ em (5-11 tuổi)`);
  if (infants > 0) parts.push(`${infants} trẻ nhỏ (<5 tuổi)`);

  return parts.length > 0 ? parts.join(', ') : `${adults} người lớn (>11 tuổi)`;
}

function logout() {
  if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
  }
}

// Định dạng ngày khởi hành: "2026-08-15" -> "15/08/2026"
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Định dạng ngày đặt (created_at từ SQLite dạng "YYYY-MM-DD HH:MM:SS") -> "15/08/2026 lúc 14:30"
function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '-';
  // SQLite CURRENT_TIMESTAMP trả về giờ UTC dạng "YYYY-MM-DD HH:MM:SS", cần thay dấu cách bằng "T" để Date hiểu đúng là UTC
  const isoStr = dateTimeStr.includes('T') ? dateTimeStr : dateTimeStr.replace(' ', 'T') + 'Z';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return dateTimeStr;
  const datePart = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timePart = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return `${datePart} lúc ${timePart}`;
}