(function() {
    const token = localStorage.getItem('adminToken');
    if (token) {

      fetch('/api/admin/stats', {
        headers: { 'Authorization': 'Bearer ' + token }
      }).then(r => {
        if (r.ok) window.location.href = '/admin.html';
        else localStorage.removeItem('adminToken');
      }).catch(() => {});
    }
  })();

  async function handleLogin(e) {
    e.preventDefault();
    const email    = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const btn      = document.getElementById('btnLogin');
    const alertBox = document.getElementById('alertBox');

    alertBox.className = 'alert';
    alertBox.textContent = '';

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>Đang xác thực...';

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success && data.token) {

        localStorage.setItem('adminToken', data.token);
        alertBox.className = 'alert success';
        alertBox.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
        setTimeout(() => { window.location.href = '/admin.html'; }, 800);
      } else {
        alertBox.className = 'alert error';
        alertBox.textContent = data.error || 'Đăng nhập thất bại';
        btn.disabled = false;
        btn.textContent = 'Đăng Nhập';
      }
    } catch (err) {
      alertBox.className = 'alert error';
      alertBox.textContent = 'Không thể kết nối đến server. Kiểm tra backend đang chạy.';
      btn.disabled = false;
      btn.textContent = 'Đăng Nhập';
    }
  }
