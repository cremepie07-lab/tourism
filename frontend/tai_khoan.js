

document.addEventListener('DOMContentLoaded', () => {
  initAccountPage();
});

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function logout() {
  if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
  }
}

async function initAccountPage() {
  const user = getCurrentUser();

  if (!user) {
    alert('Vui lòng đăng nhập để xem thông tin tài khoản');
    window.location.href = 'auth.html';
    return;
  }

  
  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
  const avatarElem = document.getElementById('avatarInitial');
  if (avatarElem) avatarElem.textContent = initial;

  const welcomeName = document.getElementById('welcomeName');
  if (welcomeName) welcomeName.textContent = `Xin chào, ${user.name}!`;

  const infoName = document.getElementById('infoName');
  if (infoName) infoName.textContent = user.name || '-';

  const infoEmail = document.getElementById('infoEmail');
  if (infoEmail) infoEmail.textContent = user.email || '-';

  const infoPhone = document.getElementById('infoPhone');
  if (infoPhone) infoPhone.textContent = user.phone || '-';

  
  await fetchUserBookings(user.id);
}

async function fetchUserBookings(userId) {
  const bookingsList = document.getElementById('bookingsList');
  if (!bookingsList) return;

  try {
    const response = await fetch(`/api/users/${userId}/bookings`);
    if (!response.ok) {
      throw new Error('Không thể lấy lịch sử đặt tour');
    }

    const bookings = await response.json();

    if (!bookings || bookings.length === 0) {
      bookingsList.innerHTML = '<p class="empty-text">Bạn chưa đặt tour nào.</p>';
      return;
    }

    bookingsList.innerHTML = bookings.map(b => {
      const date = b.created_at ? new Date(b.created_at).toLocaleDateString('vi-VN') : 'Mới đặt';
      const statusBadge = b.status === 'confirmed' || b.status === 'Đã xác nhận'
        ? '<span class="badge badge-success">Đã xác nhận</span>'
        : '<span class="badge badge-pending">Đang xử lý</span>';

      return `
        <div class="booking-item">
          <div class="booking-img">
            <img src="${b.image || 'https://via.placeholder.com/150'}" alt="${b.tour_name}">
          </div>
          <div class="booking-info">
            <h3>${b.tour_name}</h3>
            <p>📍 Địa điểm: ${b.location || '-'}</p>
            <p>📅 Ngày đặt: ${date}</p>
            <p>👤 Số khách: ${b.num_guests || 1} người</p>
            <p>💰 Tổng tiền: <strong>${(b.total_price || 0).toLocaleString('vi-VN')}đ</strong></p>
          </div>
          <div class="booking-status">
            ${statusBadge}
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('❌ Lỗi tải đặt tour:', err);
    bookingsList.innerHTML = '<p class="error-text">Không thể tải lịch sử đặt tour. Vui lòng thử lại sau.</p>';
  }
}
