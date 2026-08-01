const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hashToVerify, 'hex'));
}

// ===== CAU HINH ADMIN =====
const ADMIN_EMAIL    = 'admin@viettravel.vn';
const ADMIN_PASSWORD = 'admin@2026';
let adminToken = null;

function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token || token !== adminToken) {
    return res.status(401).json({ success: false, error: 'Unauthorized - vui long dang nhap admin' });
  }
  next();
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const path = require('path');
const fs = require('fs');
const frontendPath = path.join(__dirname, '..', 'frontend');
console.log('Frontend:', frontendPath, 'exists:', fs.existsSync(frontendPath));
if (fs.existsSync(frontendPath)) {
  console.log('Files:', fs.readdirSync(frontendPath).slice(0, 10));
}
app.use(express.static(frontendPath));
app.get('/', (req, res) => { res.redirect('/trang_chu.html'); });

const db = new sqlite3.Database('./tours.db', (err) => {
  if (err) { console.error('DB Error:', err); }
  else { console.log('DB Connected'); initializeDatabase(); }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL,
      password_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
      location TEXT NOT NULL, destination TEXT NOT NULL, durationLabel TEXT NOT NULL,
      departure TEXT NOT NULL, price REAL NOT NULL, description TEXT, image TEXT,
      rating REAL DEFAULT 0, reviews INTEGER DEFAULT 0, badge TEXT, type TEXT, details TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      email TEXT NOT NULL, phone TEXT NOT NULL, tour_id INTEGER NOT NULL,
      adults INTEGER DEFAULT 1, children INTEGER DEFAULT 0, infants INTEGER DEFAULT 0,
      departure_date TEXT, date TEXT NOT NULL, total_price REAL, user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tour_id) REFERENCES tours(id), FOREIGN KEY (user_id) REFERENCES users(id)
    )`, () => { migrateBookingsTable(); });
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT, tour_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL, rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tour_id) REFERENCES tours(id), FOREIGN KEY (user_id) REFERENCES users(id)
    )`, () => { migrateReviewsTable(); });
  });
}

function migrateReviewsTable() {
  db.run(`DELETE FROM reviews WHERE id NOT IN (SELECT MAX(id) FROM reviews GROUP BY tour_id, user_id)`, (err) => {
    if (err) console.error('Dedupe reviews error:', err.message);
    db.run(`CREATE UNIQUE INDEX IF NOT EXISTS ux_reviews_tour_user ON reviews(tour_id, user_id)`, (err2) => {
      if (err2) console.error('Index error:', err2.message);
      else console.log('Reviews table ready');
    });
  });
}

function migrateBookingsTable() {
  db.all(`PRAGMA table_info(bookings)`, (err, columns) => {
    if (err) { console.error('Schema error:', err); return; }
    const cols = columns.map(c => c.name);
    const migs = [];
    if (!cols.includes('adults'))        migs.push(`ALTER TABLE bookings ADD COLUMN adults INTEGER DEFAULT 1`);
    if (!cols.includes('children'))      migs.push(`ALTER TABLE bookings ADD COLUMN children INTEGER DEFAULT 0`);
    if (!cols.includes('infants'))       migs.push(`ALTER TABLE bookings ADD COLUMN infants INTEGER DEFAULT 0`);
    if (!cols.includes('departure_date'))migs.push(`ALTER TABLE bookings ADD COLUMN departure_date TEXT`);
    if (!cols.includes('user_id'))       migs.push(`ALTER TABLE bookings ADD COLUMN user_id INTEGER`);
    // MIGRATION: them cot trang thai booking (default 'pending' cho tat ca booking cu)
    if (!cols.includes('status'))        migs.push(`ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'pending'`);

    if (migs.length === 0) {
      console.log('Bookings schema up to date');
      insertSampleData();
      return;
    }
    db.serialize(() => {
      migs.forEach(sql => db.run(sql));
      db.run('SELECT 1', () => {
        console.log(`Migrated ${migs.length} new columns for bookings`);
        insertSampleData();
      });
    });
  });
}

function insertSampleData() {
  db.get('SELECT COUNT(*) as count FROM tours', (err, row) => {
    if (err || row.count > 0) return;
    const tours = [
      { title:"Vinh Ha Long - Du Thuyen Ngam Hoang Hon", location:"Quang Ninh", destination:"ha-long", durationLabel:"2 ngay 1 dem", departure:"Ha Noi", price:1890000, description:"Lenh denh tren du thuyen giua hang nghin dao da voi ky vi, cheo kayak kham pha hang dong va thuong thuc hai san tuoi ngon ngay tren vinh", image:"https://images.unsplash.com/photo-1559627717-bdb2d005a87e?q=80&w=735&auto=format&fit=crop", rating:4.8, reviews:1245, badge:"HOT", type:"beach", details:"Du thuyen 4 sao qua dem|Kayak kham pha Hang Sung Sot|Buffet hai san tren tau" },
      { title:"Pho Co Hoi An - Den Long & Song Hoai", location:"Quang Nam", destination:"hoi-an", durationLabel:"2 ngay 1 dem", departure:"Da Nang", price:1750000, description:"Dao buoc pho co tram nam tuoi, hoc nau mon an dia phuong va tha den hoa dang lung linh tren song Hoai ve dem", image:"https://images.unsplash.com/photo-1526139334526-f591a54b477c?q=80&w=1170&auto=format&fit=crop", rating:4.6, reviews:892, badge:"BESTSELLER", type:"culture", details:"Lop hoc nau an cung nguoi dan dia phuong|Tha den hoa dang song Hoai|Tham quan lang gom Thanh Ha" },
      { title:"Sapa - Chinh Phuc Noc Nha Dong Duong", location:"Lao Cai", destination:"sapa", durationLabel:"4 ngay 3 dem", departure:"Ha Noi", price:2650000, description:"Chinh phuc dinh Fansipan bang cap treo, trekking qua ruong bac thang Muong Hoa va nghi dem tai nha dan toc H'Mong giua nui rung Tay Bac", image:"https://images.unsplash.com/photo-1570366583862-f91883984fde?q=80&w=2071&auto=format&fit=crop", rating:4.9, reviews:1567, badge:"HOT", type:"adventure", details:"Cap treo chinh phuc dinh Fansipan|Trekking ban Cat Cat - Ta Van|Homestay cung nguoi H'Mong" },
      { title:"Co Do Hue - Dau An Trieu Nguyen", location:"Thua Thien Hue", destination:"hue", durationLabel:"2 ngay 1 dem", departure:"Da Nang", price:1550000, description:"Tham quan Dai Noi va cac lang tam co kinh, nghe ca Hue tren thuyen rong song Huong va thuong thuc am thuc cung dinh tinh te", image:"https://media.istockphoto.com/id/1215379425/vi/anh/cung-%C4%91i%E1%BB%87n-hu%E1%BA%BF-v%C3%A0-l%C4%83ng-m%E1%BB%99-ho%C3%A0ng-gia-vi%E1%BB%87t-nam.jpg?s=612x612&w=0&k=20&c=wDzMfVagXOCEPF-Jb-9J12hYkUKJtV8KKUlNQ4WDVao=", rating:4.5, reviews:610, badge:"", type:"culture", details:"Tham quan Dai Noi Hue & Lang Khai Dinh|Nghe ca Hue tren song Huong|Thuong thuc am thuc cung dinh" },
      { title:"Phu Quoc - Thien Duong Bien Dao", location:"Kien Giang", destination:"phu-quoc", durationLabel:"4 ngay 3 dem", departure:"Ho Chi Minh", price:3200000, description:"Tam bien tai Bai Sao cat trang, lan ngam san ho o An Thoi, chinh phuc cap treo vuot bien dai nhat the gioi va vui choi tai VinWonders", image:"https://images.unsplash.com/photo-1704765707896-f0aaab64d7b2?q=80&w=1387&auto=format&fit=crop", rating:4.8, reviews:1456, badge:"BESTSELLER", type:"beach", details:"Snorkeling ngam san ho An Thoi|Cap treo Hon Thom vuot bien|Vui choi VinWonders & Grand World" },
      { title:"Da Nang - Cau Vang & Bien My Khe", location:"Da Nang", destination:"da-nang", durationLabel:"3 ngay 2 dem", departure:"Da Nang", price:2050000, description:"Check-in Cau Vang noi tieng tren dinh Ba Na Hills, tam bien My Khe xanh mat va kham pha pho co Hoi An lung linh ve dem", image:"https://images.unsplash.com/photo-1684784784123-0854fc0eec25?q=80&w=687&auto=format&fit=crop", rating:4.7, reviews:987, badge:"MOI", type:"beach", details:"Check-in Cau Vang - Ba Na Hills|Tam bien My Khe|Kham pha Ngu Hanh Son & Hoi An ve dem" },
      { title:"Ha Giang - Cao Nguyen Da Dong Van", location:"Ha Giang", destination:"ha-giang", durationLabel:"5 ngay 4 dem", departure:"Ha Noi", price:3890000, description:"Vuot deo Ma Pi Leng hung vi, chinh phuc Cot co Lung Cu noi dia dau To quoc va kham pha pho co Dong Van giua cao nguyen da tai meo", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop", rating:4.9, reviews:645, badge:"SALE", type:"adventure", details:"Vuot deo Ma Pi Leng - song Nho Que|Cot co Lung Cu cuc Bac To quoc|Pho co Dong Van & Dinh vua Meo" }
    ];
    tours.forEach(t => {
      db.run(`INSERT INTO tours (title,location,destination,durationLabel,departure,price,description,image,rating,reviews,badge,type,details) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [t.title,t.location,t.destination,t.durationLabel,t.departure,t.price,t.description,t.image,t.rating,t.reviews,t.badge,t.type,t.details]);
    });
    console.log('Sample data inserted');
  });
}

// ===== API ENDPOINTS =====

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;
  if (!name || !email || !phone || !password || !confirmPassword)
    return res.status(400).json({ success: false, error: 'Vui long dien day du thong tin' });
  if (password.length < 6)
    return res.status(400).json({ success: false, error: 'Mat khau phai it nhat 6 ky tu' });
  if (password !== confirmPassword)
    return res.status(400).json({ success: false, error: 'Mat khau khong khop' });
  const emailNorm = email.trim().toLowerCase();
  db.get('SELECT id FROM users WHERE email = ?', [emailNorm], (err, existing) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (existing) return res.status(409).json({ success: false, error: 'Email nay da duoc dang ky' });
    const password_hash = hashPassword(password);
    db.run(`INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)`,
      [name.trim(), emailNorm, phone.trim(), password_hash], function(err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: 'Dang ky thanh cong!', user: { id: this.lastID, name: name.trim(), email: emailNorm, phone: phone.trim() } });
      });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Vui long dien day du thong tin' });
  const emailNorm = email.trim().toLowerCase();
  db.get('SELECT * FROM users WHERE email = ?', [emailNorm], (err, user) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!user) return res.status(401).json({ success: false, error: 'Email hoac mat khau khong dung' });
    if (!verifyPassword(password, user.password_hash)) return res.status(401).json({ success: false, error: 'Email hoac mat khau khong dung' });
    res.json({ success: true, message: 'Dang nhap thanh cong!', user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  });
});

// Lich su dat tour cua 1 user (kem trang thai booking)
app.get('/api/users/:id/bookings', (req, res) => {
  db.all(`SELECT b.*, t.title as tour_name, t.image, t.location FROM bookings b JOIN tours t ON b.tour_id = t.id WHERE b.user_id = ? ORDER BY b.created_at DESC`, [req.params.id], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/api/tours', (req, res) => {
  db.all(`SELECT t.*, COALESCE(r.reviewCount,0) as reviewCount, COALESCE(r.avgRating,0) as avgRating FROM tours t LEFT JOIN (SELECT tour_id, COUNT(*) as reviewCount, AVG(rating) as avgRating FROM reviews GROUP BY tour_id) r ON r.tour_id = t.id ORDER BY t.id DESC`, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows.map(row => ({ ...row, details: row.details ? row.details.split('|') : [], avgRating: Math.round(row.avgRating * 10) / 10 })));
  });
});

app.get('/api/tours/filter', (req, res) => {
  const { destination, departure, duration, maxPrice } = req.query;
  let q = `SELECT t.*, COALESCE(r.reviewCount,0) as reviewCount, COALESCE(r.avgRating,0) as avgRating FROM tours t LEFT JOIN (SELECT tour_id, COUNT(*) as reviewCount, AVG(rating) as avgRating FROM reviews GROUP BY tour_id) r ON r.tour_id = t.id WHERE 1=1`;
  const p = [];
  if (destination && destination !== '') { q += ' AND t.destination = ?'; p.push(destination); }
  if (departure && departure !== '') { q += ' AND t.departure = ?'; p.push(departure); }
  if (duration && duration !== '') { q += ' AND t.durationLabel = ?'; p.push(duration); }
  if (maxPrice && maxPrice !== '') { q += ' AND t.price <= ?'; p.push(parseFloat(maxPrice)); }
  q += ' ORDER BY t.id DESC';
  db.all(q, p, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows.map(row => ({ ...row, details: row.details ? row.details.split('|') : [], avgRating: Math.round(row.avgRating * 10) / 10 })));
  });
});

app.get('/api/tours/:id', (req, res) => {
  db.get('SELECT * FROM tours WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Tour not found' });
    db.get('SELECT COUNT(*) as reviewCount, AVG(rating) as avgRating FROM reviews WHERE tour_id = ?', [req.params.id], (err2, stats) => {
      res.json({ ...row, details: row.details ? row.details.split('|') : [], reviewCount: stats && stats.reviewCount ? stats.reviewCount : 0, avgRating: stats && stats.avgRating ? Math.round(stats.avgRating * 10) / 10 : 0 });
    });
  });
});

app.get('/api/tours/:id/reviews', (req, res) => {
  db.all(`SELECT r.id, r.user_id, r.rating, r.comment, r.created_at, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.tour_id = ? ORDER BY r.created_at DESC`, [req.params.id], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Kiem tra quyen danh gia cua 1 user tren 1 tour (da dat, da di xong)
app.get('/api/tours/:id/can-review', (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  if (!user_id) {
    return res.json({ canReview: false, hasReviewed: false, reason: 'not_logged_in', message: 'Vui lòng đăng nhập để đánh giá tour.' });
  }
  db.get('SELECT id FROM reviews WHERE tour_id = ? AND user_id = ?', [id, user_id], (err, review) => {
    if (err) return res.status(500).json({ error: err.message });
    if (review) {
      return res.json({ canReview: true, hasReviewed: true, reason: 'reviewed', message: 'Bạn đã đánh giá tour này.' });
    }
    db.get(`SELECT id, status, date(COALESCE(departure_date, date)) AS dep FROM bookings WHERE user_id = ? AND tour_id = ? ORDER BY created_at DESC LIMIT 1`, [user_id, id], (err2, booking) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (!booking) {
        return res.json({ canReview: false, hasReviewed: false, reason: 'not_booked', message: 'Bạn chưa đặt tour này.' });
      }
      if (booking.status === 'cancelled') {
        return res.json({ canReview: false, hasReviewed: false, reason: 'cancelled', message: 'Đặt tour của bạn đã bị hủy nên không thể đánh giá.' });
      }
      const todayStr = new Date().toISOString().split('T')[0];
      const eligible = (booking.status === 'confirmed' || booking.status === 'completed') && booking.dep && booking.dep <= todayStr;
      if (!eligible) {
        return res.json({ canReview: false, hasReviewed: false, reason: 'not_eligible', message: 'Bạn chỉ có thể đánh giá tour sau khi chuyến đi đã hoàn thành.' });
      }
      res.json({ canReview: true, hasReviewed: false, reason: 'eligible', message: '' });
    });
  });
});

app.post('/api/reviews', (req, res) => {
  const { tour_id, user_id, rating, comment } = req.body;
  if (!tour_id || !user_id || !rating || !comment || !comment.trim()) return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ thông tin đánh giá' });

  // Kiểm tra khách đã đặt tour, booking được xác nhận/hoàn thành VÀ ngày khởi hành đã qua (đã đi xong)
  const sqlCheck = `SELECT id FROM bookings WHERE user_id = ? AND tour_id = ? AND status IN ('confirmed','completed') AND date(COALESCE(departure_date, date)) <= date('now', 'localtime') LIMIT 1`;
  
  db.get(sqlCheck, [user_id, tour_id], (err, booking) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!booking) {
      return res.status(403).json({ success: false, error: 'Bạn chỉ có thể đánh giá sau khi đã tham gia và hoàn thành tour này.' });
    }

    const ratingNum = parseInt(rating, 10);
    if (ratingNum < 1 || ratingNum > 5) return res.status(400).json({ success: false, error: 'Số sao phải từ 1 đến 5' });

    db.run(`INSERT INTO reviews (tour_id, user_id, rating, comment) VALUES (?, ?, ?, ?) ON CONFLICT(tour_id, user_id) DO UPDATE SET rating = excluded.rating, comment = excluded.comment, created_at = CURRENT_TIMESTAMP`, 
      [tour_id, user_id, ratingNum, comment.trim()], function(insertErr) {
      if (insertErr) return res.status(500).json({ success: false, error: insertErr.message });
      res.json({ success: true, message: 'Cảm ơn bạn đã chia sẻ trải nghiệm!', review_id: this.lastID });
    });
  });
});

app.post('/api/bookings', (req, res) => {
  const { name, email, phone, tour_id, adults, children, infants, departure_date, date, user_id } = req.body;
  const soNguoiLon = parseInt(adults, 10) || 1;
  const soTreEm = parseInt(children, 10) || 0;
  const soTreNho = parseInt(infants, 10) || 0;
  if (!name || !email || !phone || !tour_id || !date) return res.status(400).json({ error: 'Missing required fields' });
  db.get('SELECT price FROM tours WHERE id = ?', [tour_id], (err, tour) => {
    if (!tour) return res.status(404).json({ error: 'Tour not found' });
    const total_price = tour.price * soNguoiLon + tour.price * 0.75 * soTreEm;
    db.run(`INSERT INTO bookings (name,email,phone,tour_id,adults,children,infants,departure_date,date,total_price,user_id,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending')`,
      [name, email, phone, tour_id, soNguoiLon, soTreEm, soTreNho, departure_date || null, date, total_price, user_id || null], function(err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ success: true, booking_id: this.lastID, total_price });
      });
  });
});

app.get('/api/bookings', (req, res) => {
  db.all(`SELECT b.*, t.title as tour_name, t.price FROM bookings b JOIN tours t ON b.tour_id = t.id ORDER BY b.created_at DESC`, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// ===== ADMIN API ENDPOINTS =====

// Dang nhap admin
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Vui long nhap email va mat khau' });
  if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD)
    return res.status(401).json({ success: false, error: 'Email hoac mat khau admin khong dung' });
  adminToken = crypto.randomBytes(32).toString('hex');
  console.log('Admin logged in');
  res.json({ success: true, message: 'Dang nhap admin thanh cong!', token: adminToken });
});

// Dang xuat admin
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  adminToken = null;
  res.json({ success: true, message: 'Da dang xuat' });
});

// Thong ke tong quan
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const stats = {};
  db.get('SELECT COUNT(*) as total FROM tours', (e1, r1) => {
    if (e1) return res.status(500).json({ error: e1.message });
    stats.totalTours = r1.total;
    db.get('SELECT COUNT(*) as total FROM users', (e2, r2) => {
      if (e2) return res.status(500).json({ error: e2.message });
      stats.totalUsers = r2.total;
      db.get('SELECT COUNT(*) as total FROM bookings', (e3, r3) => {
        if (e3) return res.status(500).json({ error: e3.message });
        stats.totalBookings = r3.total;
        db.get(`SELECT COALESCE(SUM(total_price),0) as revenue FROM bookings WHERE status != 'cancelled'`, (e4, r4) => {
          if (e4) return res.status(500).json({ error: e4.message });
          stats.totalRevenue = r4.revenue;
          db.all('SELECT status, COUNT(*) as count FROM bookings GROUP BY status', (e5, rows5) => {
            if (e5) return res.status(500).json({ error: e5.message });
            stats.bookingsByStatus = {};
            rows5.forEach(r => { stats.bookingsByStatus[r.status || 'pending'] = r.count; });
            res.json(stats);
          });
        });
      });
    });
  });
});

// Lay danh sach tour (admin)
app.get('/api/admin/tours', requireAdmin, (req, res) => {
  db.all(`SELECT t.*, COALESCE(b.bookingCount,0) as bookingCount, COALESCE(r.reviewCount,0) as reviewCount, COALESCE(r.avgRating,0) as avgRating FROM tours t LEFT JOIN (SELECT tour_id, COUNT(*) as bookingCount FROM bookings GROUP BY tour_id) b ON b.tour_id = t.id LEFT JOIN (SELECT tour_id, COUNT(*) as reviewCount, AVG(rating) as avgRating FROM reviews GROUP BY tour_id) r ON r.tour_id = t.id ORDER BY t.id DESC`, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Them tour moi (admin)
app.post('/api/admin/tours', requireAdmin, (req, res) => {
  const { title, location, destination, durationLabel, departure, price, description, image, badge, type, details } = req.body;
  if (!title || !location || !destination || !durationLabel || !departure || !price)
    return res.status(400).json({ success: false, error: 'Vui long dien day du thong tin bat buoc' });
  const detailsStr = Array.isArray(details) ? details.join('|') : (details || '');
  db.run(`INSERT INTO tours (title,location,destination,durationLabel,departure,price,description,image,badge,type,details,rating,reviews) VALUES (?,?,?,?,?,?,?,?,?,?,?,0,0)`,
    [title, location, destination, durationLabel, departure, parseFloat(price), description||'', image||'', badge||'', type||'', detailsStr], function(err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: 'Them tour thanh cong!', tour_id: this.lastID });
    });
});

// Sua tour (admin)
app.put('/api/admin/tours/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, location, destination, durationLabel, departure, price, description, image, badge, type, details } = req.body;
  if (!title || !location || !destination || !durationLabel || !departure || !price)
    return res.status(400).json({ success: false, error: 'Vui long dien day du thong tin bat buoc' });
  const detailsStr = Array.isArray(details) ? details.join('|') : (details || '');
  db.run(`UPDATE tours SET title=?,location=?,destination=?,durationLabel=?,departure=?,price=?,description=?,image=?,badge=?,type=?,details=? WHERE id=?`,
    [title, location, destination, durationLabel, departure, parseFloat(price), description||'', image||'', badge||'', type||'', detailsStr, id], function(err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (this.changes === 0) return res.status(404).json({ success: false, error: 'Tour khong ton tai' });
      res.json({ success: true, message: 'Cap nhat tour thanh cong!' });
    });
});

// Xoa tour (kèm cascade xoa bookings & reviews)
app.delete('/api/admin/tours/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  db.serialize(() => {
    db.run(`DELETE FROM reviews WHERE tour_id = ?`, [id]);
    db.run(`DELETE FROM bookings WHERE tour_id = ?`, [id]);
    db.run(`DELETE FROM tours WHERE id = ?`, [id], function(err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (this.changes === 0) return res.status(404).json({ success: false, error: 'Tour khong ton tai' });
      res.json({ success: true, message: 'Da xoa tour va toan bo booking/danh gia lien quan' });
    });
  });
});

// Lay danh sach khach hang (admin, kem tong booking & chi tieu)
app.get('/api/admin/users', requireAdmin, (req, res) => {
  db.all(`SELECT u.id, u.name, u.email, u.phone, u.created_at, COUNT(b.id) as totalBookings, COALESCE(SUM(b.total_price),0) as totalSpent FROM users u LEFT JOIN bookings b ON b.user_id = u.id GROUP BY u.id ORDER BY u.created_at DESC`, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Xoa khach hang (admin)
app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  db.serialize(() => {
    db.run(`DELETE FROM reviews WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM bookings WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (this.changes === 0) return res.status(404).json({ success: false, error: 'Khach hang khong ton tai' });
      res.json({ success: true, message: 'Da xoa khach hang va toan bo du lieu lien quan' });
    });
  });
});

// Lay tat ca bookings (admin, co filter theo status)
app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  const { status } = req.query;
  let q = `SELECT b.*, t.title as tour_name, t.location as tour_location FROM bookings b JOIN tours t ON b.tour_id = t.id WHERE 1=1`;
  const p = [];
  if (status && status !== 'all') { q += ' AND b.status = ?'; p.push(status); }
  q += ' ORDER BY b.created_at DESC';
  db.all(q, p, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Doi trang thai booking (admin)
app.put('/api/admin/bookings/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ success: false, error: 'Trang thai khong hop le' });
  db.run(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, error: 'Booking khong ton tai' });
    res.json({ success: true, message: 'Cap nhat trang thai thanh cong!' });
  });
});

// Xoa booking (admin)
app.delete('/api/admin/bookings/:id', requireAdmin, (req, res) => {
  db.run(`DELETE FROM bookings WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, error: 'Booking khong ton tai' });
    res.json({ success: true, message: 'Da xoa booking' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Admin login: admin@viettravel.vn / admin@2026');
});

