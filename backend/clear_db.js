const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tours.db', (err) => {
  if (err) {
    console.error('❌ Error:', err.message);
    return;
  }

  console.log('✅ Connected to database');

  db.serialize(() => {
    // Xóa dữ liệu bookings trước (vì có khóa ngoại tới tours & users)
    db.run('DELETE FROM bookings', (err) => {
      if (err) {
        console.error('❌ Error deleting bookings:', err.message);
      } else {
        console.log('✅ Deleted all bookings');
      }
    });

    // Xóa dữ liệu tours
    db.run('DELETE FROM tours', (err) => {
      if (err) {
        console.error('❌ Error deleting tours:', err.message);
      } else {
        console.log('✅ Deleted all tours');
      }
    });

    // Xóa dữ liệu users (tài khoản đăng ký)
    db.run('DELETE FROM users', (err) => {
      if (err) {
        console.error('❌ Error deleting users:', err.message);
      } else {
        console.log('✅ Deleted all users');
      }
    });

    // Reset lại bộ đếm AUTOINCREMENT (id sẽ bắt đầu lại từ 1)
    db.run(`DELETE FROM sqlite_sequence WHERE name IN ('bookings', 'tours', 'users')`, (err) => {
      if (err) {
        console.error('⚠️ Không reset được AUTOINCREMENT (có thể chưa từng dùng):', err.message);
      } else {
        console.log('✅ Reset ID về 1 cho các bảng');
      }

      db.close(() => {
        console.log('✅ Database closed - Đã xóa sạch dữ liệu!');
      });
    });
  });
});