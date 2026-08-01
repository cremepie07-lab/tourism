const API = ''; 

let adminToken   = localStorage.getItem('adminToken') || null;
let currentTab   = 'dashboard';
let allBookings  = [];  
let editingTourId = null;

(function checkAuth() {
  if (!adminToken) {
    window.location.href = '/admin_login.html';
    return;
  }

  fetch('/api/admin/stats', {
    headers: { 'Authorization': 'Bearer ' + adminToken }
  }).then(r => {
    if (!r.ok) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin_login.html';
    }
  }).catch(() => {

  });
})();

document.addEventListener('DOMContentLoaded', () => {

  switchTab('dashboard');

  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
});

function switchTab(tab) {
  currentTab = tab;

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });

  document.querySelectorAll('.tab-section').forEach(el => {
    el.classList.toggle('active', el.id === 'tab-' + tab);
  });

  const titles = {
    dashboard: 'Tong Quan',
    tours:     'Quan Ly Tour',
    customers: 'Quan Ly Khach Hang',
    bookings:  'Quan Ly Dat Tour'
  };
  document.getElementById('pageTitle').textContent = titles[tab] || '';

  if (tab === 'dashboard') loadDashboard();
  if (tab === 'tours')     loadTours();
  if (tab === 'customers') loadCustomers();
  if (tab === 'bookings')  loadBookings();

  closeSidebar();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

async function logout() {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + adminToken }
    });
  } catch(e) {}
  localStorage.removeItem('adminToken');
  window.location.href = '/admin_login.html';
}

async function apiRequest(method, endpoint, body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': 'Bearer ' + adminToken,
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(endpoint, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Server error ' + res.status);
  return data;
}

let toastTimer = null;
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = ''; }, 3000);
}

function fmtMoney(n) {
  return Number(n || 0).toLocaleString('vi-VN') + 'đ';
}
function fmtDate(str) {
  if (!str) return '-';
  const d = new Date(str.includes('T') ? str : str.replace(' ','T') + 'Z');
  if (isNaN(d)) return str;
  return d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
}
function fmtDateTime(str) {
  if (!str) return '-';
  const d = new Date(str.includes('T') ? str : str.replace(' ','T') + 'Z');
  if (isNaN(d)) return str;
  return d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'})
    + ' ' + d.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
}
function fmtBadge(badge) {
  if (!badge) return '';
  const map = { HOT:'badge-hot', BESTSELLER:'badge-bestseller', SALE:'badge-sale', MOI:'badge-new', 'MỚI':'badge-new' };
  const cls = map[badge] || 'badge-default';
  return `<span class="badge ${cls}">${badge}</span>`;
}
function fmtStatus(status) {
  const map = {
    pending:   ['Cho xu ly',    'pending'],
    confirmed: ['Da xac nhan',  'confirmed'],
    completed: ['Hoan thanh',   'completed'],
    cancelled: ['Da huy',       'cancelled']
  };
  const viMap = {
    pending:   'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  };
  const s = status || 'pending';
  const cls = map[s] ? map[s][1] : 'pending';
  return `<span class="status-badge ${cls}">${viMap[s] || s}</span>`;
}
function fmtPax(b) {
  const parts = [];
  if (Number(b.adults) > 0)   parts.push(b.adults + ' NL');
  if (Number(b.children) > 0) parts.push(b.children + ' TE');
  if (Number(b.infants) > 0)  parts.push(b.infants + ' TN');
  return parts.join(', ') || '1 NL';
}

function formatPriceInput(input) {
  let val = String(input.value).replace(/\D/g, '');
  if (!val) {
    input.value = '';
    return;
  }
  input.value = Number(val).toLocaleString('vi-VN');
}

async function loadDashboard() {
  try {
    const stats = await apiRequest('GET', '/api/admin/stats');

    document.getElementById('statTours').textContent    = stats.totalTours || 0;
    document.getElementById('statUsers').textContent    = stats.totalUsers || 0;
    document.getElementById('statBookings').textContent = stats.totalBookings || 0;
    document.getElementById('statRevenue').textContent  = fmtMoney(stats.totalRevenue);

    const bs = stats.bookingsByStatus || {};
    document.getElementById('statPending').textContent   = bs.pending   || 0;
    document.getElementById('statConfirmed').textContent = bs.confirmed || 0;
    document.getElementById('statCompleted').textContent = bs.completed || 0;
    document.getElementById('statCancelled').textContent = bs.cancelled || 0;

  } catch(e) {
    console.error('Dashboard error:', e);
  }
}

async function loadTours() {
  const tbody = document.getElementById('toursBody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="8"><span class="loading-text">Đang tải dữ liệu...</span></td></tr>';

  try {
    const tours = await apiRequest('GET', '/api/admin/tours');
    if (!tours.length) {
      tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">🗺️</div><p>Chưa có tour nào</p></div></td></tr>';
      return;
    }
    tbody.innerHTML = tours.map(t => `
      <tr>
        <td><img src="${t.image || ''}" alt="" class="tour-img" onerror="this.style.display='none'"></td>
        <td>
          <div class="tour-name-cell">
            <div>
              <div class="name">${t.title}</div>
              <div class="sub">${t.location} · ${t.durationLabel}</div>
            </div>
          </div>
        </td>
        <td>${t.departure || '-'}</td>
        <td>${fmtMoney(t.price)}</td>
        <td>${fmtBadge(t.badge) || '<span style="color:var(--text-muted)">-</span>'}</td>
        <td style="text-align:center">${t.bookingCount || 0}</td>
        <td style="text-align:center">${t.reviewCount || 0}</td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="openEditTour(${t.id})">✏️ Sửa</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteTour(${t.id}, '${escHtml(t.title)}')">🗑️ Xóa</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="8" style="color:var(--status-cancelled);padding:20px">${e.message}</td></tr>`;
  }
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/'/g,"\\'").replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function openAddTour() {
  editingTourId = null;
  document.getElementById('tourModalTitle').textContent = 'Thêm Tour Mới';
  document.getElementById('tourForm').reset();
  document.getElementById('tourFormAlert').className = 'form-alert';
  openModal('tourModal');
}

async function openEditTour(id) {
  editingTourId = id;
  document.getElementById('tourModalTitle').textContent = 'Chỉnh Sửa Tour';
  document.getElementById('tourFormAlert').className = 'form-alert';
  openModal('tourModal');

  try {
    const tour = await apiRequest('GET', `/api/tours/${id}`);
    document.getElementById('tf_title').value       = tour.title || '';
    document.getElementById('tf_location').value    = tour.location || '';
    document.getElementById('tf_destination').value = tour.destination || '';
    document.getElementById('tf_duration').value    = tour.durationLabel || '';
    document.getElementById('tf_departure').value   = tour.departure || '';
    document.getElementById('tf_price').value       = tour.price ? Number(tour.price).toLocaleString('vi-VN') : '';
    document.getElementById('tf_badge').value       = tour.badge || '';
    document.getElementById('tf_type').value        = tour.type || '';
    document.getElementById('tf_image').value       = tour.image || '';
    document.getElementById('tf_description').value = tour.description || '';

    const detailsArr = Array.isArray(tour.details) ? tour.details : (tour.details || '').split('|').filter(Boolean);
    document.getElementById('tf_details').value = detailsArr.join('\n');
  } catch(e) {
    document.getElementById('tourFormAlert').className = 'form-alert error';
    document.getElementById('tourFormAlert').textContent = 'Khong the tai du lieu tour: ' + e.message;
  }
}

async function submitTourForm() {
  const alertEl = document.getElementById('tourFormAlert');
  alertEl.className = 'form-alert';

  const details = document.getElementById('tf_details').value
    .split('\n').map(s=>s.trim()).filter(Boolean);

  const payload = {
    title:       document.getElementById('tf_title').value.trim(),
    location:    document.getElementById('tf_location').value.trim(),
    destination: document.getElementById('tf_destination').value.trim(),
    durationLabel: document.getElementById('tf_duration').value.trim(),
    departure:   document.getElementById('tf_departure').value.trim(),
    price:       document.getElementById('tf_price').value.replace(/\D/g, ''),
    badge:       document.getElementById('tf_badge').value.trim(),
    type:        document.getElementById('tf_type').value,
    image:       document.getElementById('tf_image').value.trim(),
    description: document.getElementById('tf_description').value.trim(),
    details
  };

  if (!payload.title || !payload.location || !payload.destination || !payload.durationLabel || !payload.departure || !payload.price) {
    alertEl.className = 'form-alert error';
    alertEl.textContent = 'Vui lòng điền đầy đủ các trường bắt buộc (*)';
    return;
  }

  const btn = document.getElementById('btnSubmitTour');
  btn.disabled = true;
  btn.textContent = 'Đang lưu...';

  try {
    if (editingTourId) {
      await apiRequest('PUT', `/api/admin/tours/${editingTourId}`, payload);
      showToast('✅ Cập nhật tour thành công!');
    } else {
      await apiRequest('POST', '/api/admin/tours', payload);
      showToast('✅ Thêm tour mới thành công!');
    }
    closeModal('tourModal');
    loadTours();
  } catch(e) {
    alertEl.className = 'form-alert error';
    alertEl.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Lưu Tour';
  }
}

function confirmDeleteTour(id, name) {
  document.getElementById('confirmMsg').textContent = `Bạn chắc chắn muốn xóa tour "${name}"? Tất cả booking và đánh giá liên quan cũng sẽ bị xóa.`;
  document.getElementById('btnConfirmOk').onclick = () => deleteTour(id);
  openConfirm();
}

async function deleteTour(id) {
  closeConfirm();
  try {
    await apiRequest('DELETE', `/api/admin/tours/${id}`);
    showToast('✅ Đã xóa tour thành công!');
    loadTours();
    loadDashboard();
  } catch(e) {
    showToast('❌ ' + e.message, 'error');
  }
}

async function loadCustomers() {
  const tbody = document.getElementById('customersBody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="6"><span class="loading-text">Đang tải dữ liệu...</span></td></tr>';

  try {
    const users = await apiRequest('GET', '/api/admin/users');
    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">👥</div><p>Chưa có khách hàng nào</p></div></td></tr>';
      return;
    }
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td><strong>${escHtml(u.name)}</strong></td>
        <td>${escHtml(u.email)}</td>
        <td>${escHtml(u.phone || '-')}</td>
        <td style="text-align:center">${u.totalBookings || 0}</td>
        <td>${fmtMoney(u.totalSpent)}</td>
        <td>${fmtDate(u.created_at)}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${u.id}, '${escHtml(u.name)}')">🗑️ Xóa</button>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="8" style="color:var(--status-cancelled);padding:20px">${e.message}</td></tr>`;
  }
}

function confirmDeleteUser(id, name) {
  document.getElementById('confirmMsg').textContent = `Bạn chắc chắn muốn xóa tài khoản "${name}"? Tất cả booking và đánh giá của họ cũng sẽ bị xóa.`;
  document.getElementById('btnConfirmOk').onclick = () => deleteUser(id);
  openConfirm();
}

async function deleteUser(id) {
  closeConfirm();
  try {
    await apiRequest('DELETE', `/api/admin/users/${id}`);
    showToast('✅ Đã xóa khách hàng thành công!');
    loadCustomers();
    loadDashboard();
  } catch(e) {
    showToast('❌ ' + e.message, 'error');
  }
}

let currentStatusFilter = 'all';

async function loadBookings(statusFilter) {
  if (statusFilter !== undefined) currentStatusFilter = statusFilter;

  document.querySelectorAll('.filter-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.status === currentStatusFilter);
  });

  const tbody = document.getElementById('bookingsBody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="9"><span class="loading-text">Đang tải dữ liệu...</span></td></tr>';

  try {
    const url = '/api/admin/bookings' + (currentStatusFilter !== 'all' ? '?status=' + currentStatusFilter : '');
    allBookings = await apiRequest('GET', url);

    if (!allBookings.length) {
      tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><div class="empty-icon">📋</div><p>Không có booking nào</p></div></td></tr>';
      return;
    }

    tbody.innerHTML = allBookings.map(b => `
      <tr id="booking-row-${b.id}">
        <td>#${b.id}</td>
        <td>
          <div><strong>${escHtml(b.name)}</strong></div>
          <div style="font-size:0.78rem;color:var(--text-muted)">${escHtml(b.email)}</div>
        </td>
        <td>
          <div>${escHtml(b.tour_name)}</div>
          <div style="font-size:0.78rem;color:var(--text-muted)">${escHtml(b.tour_location||'')}</div>
        </td>
        <td style="text-align:center">${fmtPax(b)}</td>
        <td>${fmtDate(b.departure_date || b.date)}</td>
        <td>${fmtMoney(b.total_price)}</td>
        <td>
          <select class="status-select" onchange="updateBookingStatus(${b.id}, this.value)" id="status-sel-${b.id}">
            <option value="pending"   ${(b.status||'pending')==='pending'   ? 'selected' : ''}>Chờ xử lý</option>
            <option value="confirmed" ${(b.status||'pending')==='confirmed' ? 'selected' : ''}>Đã xác nhận</option>
            <option value="completed" ${(b.status||'pending')==='completed' ? 'selected' : ''}>Hoàn thành</option>
            <option value="cancelled" ${(b.status||'pending')==='cancelled' ? 'selected' : ''}>Đã hủy</option>
          </select>
        </td>
        <td>${fmtDateTime(b.created_at)}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="confirmDeleteBooking(${b.id})">🗑️</button>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="9" style="color:var(--status-cancelled);padding:20px">${e.message}</td></tr>`;
  }
}

async function updateBookingStatus(id, status) {
  try {
    await apiRequest('PUT', `/api/admin/bookings/${id}/status`, { status });
    showToast('✅ Đã cập nhật trạng thái!');

    if (currentTab === 'bookings') loadDashboard();
  } catch(e) {
    showToast('❌ ' + e.message, 'error');

    loadBookings();
  }
}

function confirmDeleteBooking(id) {
  document.getElementById('confirmMsg').textContent = `Bạn chắc chắn muốn xóa booking #${id}?`;
  document.getElementById('btnConfirmOk').onclick = () => deleteBooking(id);
  openConfirm();
}

async function deleteBooking(id) {
  closeConfirm();
  try {
    await apiRequest('DELETE', `/api/admin/bookings/${id}`);
    showToast('✅ Đã xóa booking!');
    loadBookings();
    loadDashboard();
  } catch(e) {
    showToast('❌ ' + e.message, 'error');
  }
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function openConfirm() {
  document.getElementById('confirmOverlay').classList.add('open');
}
function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
}
