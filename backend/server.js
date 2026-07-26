const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// ===== HÀM HASH MẬT KHẨU (dùng crypto có sẵn của Node, không cần cài thêm thư viện) =====
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

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Phục vụ luôn frontend (html/css/js) từ chính server này -> chạy giống 1
// website bình thường tại http://localhost:5000/, không cần Live Server nữa.
// (Yêu cầu: các file .html/.css/.js nằm chung thư mục với server.js)
const path = require('path');
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => { res.redirect('/trang_chu.html'); });

// ===== SETUP DATABASE =====
const db = new sqlite3.Database('./tours.db', (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Hàm tạo bảng
function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS tours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        destination TEXT NOT NULL,
        durationLabel TEXT NOT NULL,
        departure TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT,
        rating REAL DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        badge TEXT,
        type TEXT,
        details TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        tour_id INTEGER NOT NULL,
        adults INTEGER DEFAULT 1,
        children INTEGER DEFAULT 0,
        infants INTEGER DEFAULT 0,
        departure_date TEXT,
        date TEXT NOT NULL,
        total_price REAL,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, () => {
      migrateBookingsTable();
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tour_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, () => {
      migrateReviewsTable();
    });
  });
}

// Dọn dẹp review trùng lặp (1 người dùng lỡ đánh giá nhiều lần cho cùng 1 tour
// trước khi có ràng buộc UNIQUE) rồi tạo UNIQUE INDEX để chặn trùng lặp về sau.
function migrateReviewsTable() {
  db.run(`
    DELETE FROM reviews
    WHERE id NOT IN (
      SELECT MAX(id) FROM reviews GROUP BY tour_id, user_id
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error dedupe reviews:', err.message);
    }
    db.run(
      `CREATE UNIQUE INDEX IF NOT EXISTS ux_reviews_tour_user ON reviews(tour_id, user_id)`,
      (err2) => {
        if (err2) {
          console.error('❌ Error creating unique index on reviews:', err2.message);
        } else {
          console.log('📊 Reviews table ready (unique per user/tour)');
        }
      }
    );
  });
}

// Đồng bộ schema cho DB cũ (đã tồn tại trước khi có tính năng người lớn/trẻ em/trẻ nhỏ)
function migrateBookingsTable() {
  db.all(`PRAGMA table_info(bookings)`, (err, columns) => {
    if (err) {
      console.error('❌ Error reading bookings schema:', err);
      return;
    }
    const columnNames = columns.map(c => c.name);
    const migrations = [];

    if (!columnNames.includes('adults')) {
      migrations.push(`ALTER TABLE bookings ADD COLUMN adults INTEGER DEFAULT 1`);
    }
    if (!columnNames.includes('children')) {
      migrations.push(`ALTER TABLE bookings ADD COLUMN children INTEGER DEFAULT 0`);
    }
    if (!columnNames.includes('infants')) {
      migrations.push(`ALTER TABLE bookings ADD COLUMN infants INTEGER DEFAULT 0`);
    }
    if (!columnNames.includes('departure_date')) {
      migrations.push(`ALTER TABLE bookings ADD COLUMN departure_date TEXT`);
    }
    if (!columnNames.includes('user_id')) {
      migrations.push(`ALTER TABLE bookings ADD COLUMN user_id INTEGER`);
    }

    if (migrations.length === 0) {
      console.log('📊 Database tables ready (bookings schema up to date)');
      insertSampleData();
      return;
    }

    db.serialize(() => {
      migrations.forEach(sql => db.run(sql));
      db.run('SELECT 1', () => {
        console.log(`📊 Database tables ready (migrated ${migrations.length} cột mới cho bookings)`);
        insertSampleData();
      });
    });
  });
}

// Thêm dữ liệu mẫu từ hardcoded data
function insertSampleData() {
  db.get('SELECT COUNT(*) as count FROM tours', (err, row) => {
    if (err) {
      console.error('❌ Error checking tours count:', err);
      return;
    }
    if (row.count === 0) {
      const sampleTours = [
        {
          title: "Vịnh Hạ Long - Du Thuyền Ngắm Hoàng Hôn",
          location: "Quảng Ninh",
          destination: "ha-long",
          durationLabel: "2 ngày 1 đêm",
          departure: "Hà Nội",
          price: 1890000,
          description: "Lênh đênh trên du thuyền giữa hàng nghìn đảo đá vôi kỳ vĩ, chèo kayak khám phá hang động và thưởng thức hải sản tươi ngon ngay trên vịnh",
          image: "https://images.unsplash.com/photo-1559627717-bdb2d005a87e?q=80&w=735&auto=format&fit=crop",
          rating: 4.8,
          reviews: 1245,
          badge: "HOT",
          type: "beach",
          details: "Du thuyền 4 sao qua đêm|Kayak khám phá Hang Sửng Sốt|Buffet hải sản trên tàu"
        },
        {
          title: "Phố Cổ Hội An - Đèn Lồng & Sông Hoài",
          location: "Quảng Nam",
          destination: "hoi-an",
          durationLabel: "2 ngày 1 đêm",
          departure: "Đà Nẵng",
          price: 1750000,
          description: "Dạo bước phố cổ trăm năm tuổi, học nấu món ăn địa phương và thả đèn hoa đăng lung linh trên sông Hoài về đêm",
          image: "https://images.unsplash.com/photo-1526139334526-f591a54b477c?q=80&w=1170&auto=format&fit=crop",
          rating: 4.6,
          reviews: 892,
          badge: "BESTSELLER",
          type: "culture",
          details: "Lớp học nấu ăn cùng người dân địa phương|Thả đèn hoa đăng sông Hoài|Tham quan làng gốm Thanh Hà"
        },
        {
          title: "Sapa - Chinh Phục Nóc Nhà Đông Dương",
          location: "Lào Cai",
          destination: "sapa",
          durationLabel: "4 ngày 3 đêm",
          departure: "Hà Nội",
          price: 2650000,
          description: "Chinh phục đỉnh Fansipan bằng cáp treo, trekking qua ruộng bậc thang Mường Hoa và nghỉ đêm tại nhà dân tộc H'Mông giữa núi rừng Tây Bắc",
          image: "https://images.unsplash.com/photo-1570366583862-f91883984fde?q=80&w=2071&auto=format&fit=crop",
          rating: 4.9,
          reviews: 1567,
          badge: "HOT",
          type: "adventure",
          details: "Cáp treo chinh phục đỉnh Fansipan|Trekking bản Cát Cát - Tả Van|Homestay cùng người H'Mông"
        },
        {
          title: "Cố Đô Huế - Dấu Ấn Triều Nguyễn",
          location: "Thừa Thiên Huế",
          destination: "hue",
          durationLabel: "2 ngày 1 đêm",
          departure: "Đà Nẵng",
          price: 1550000,
          description: "Tham quan Đại Nội và các lăng tẩm cổ kính, nghe ca Huế trên thuyền rồng sông Hương và thưởng thức ẩm thực cung đình tinh tế",
          image: "https://media.istockphoto.com/id/1215379425/vi/anh/cung-%C4%91i%E1%BB%87n-hu%E1%BA%BF-v%C3%A0-l%C4%83ng-m%E1%BB%99-ho%C3%A0ng-gia-vi%E1%BB%87t-nam.jpg?s=612x612&w=0&k=20&c=wDzMfVagXOCEPF-Jb-9J12hYkUKJtV8KKUlNQ4WDVao=",
          rating: 4.5,
          reviews: 610,
          badge: "",
          type: "culture",
          details: "Tham quan Đại Nội Huế & Lăng Khải Định|Nghe ca Huế trên sông Hương|Thưởng thức ẩm thực cung đình"
        },
        {
          title: "Phú Quốc - Thiên Đường Biển Đảo",
          location: "Kiên Giang",
          destination: "phu-quoc",
          durationLabel: "4 ngày 3 đêm",
          departure: "Hồ Chí Minh",
          price: 3200000,
          description: "Tắm biển tại Bãi Sao cát trắng, lặn ngắm san hô ở An Thới, chinh phục cáp treo vượt biển dài nhất thế giới và vui chơi tại VinWonders",
          image: "https://images.unsplash.com/photo-1704765707896-f0aaab64d7b2?q=80&w=1387&auto=format&fit=crop",
          rating: 4.8,
          reviews: 1456,
          badge: "BESTSELLER",
          type: "beach",
          details: "Snorkeling ngắm san hô An Thới|Cáp treo Hòn Thơm vượt biển|Vui chơi VinWonders & Grand World"
        },
        {
          title: "Đà Nẵng - Cầu Vàng & Biển Mỹ Khê",
          location: "Đà Nẵng",
          destination: "da-nang",
          durationLabel: "3 ngày 2 đêm",
          departure: "Đà Nẵng",
          price: 2050000,
          description: "Check-in Cầu Vàng nổi tiếng trên đỉnh Bà Nà Hills, tắm biển Mỹ Khê xanh mát và khám phá phố cổ Hội An lung linh về đêm",
          image: "https://images.unsplash.com/photo-1684784784123-0854fc0eec25?q=80&w=687&auto=format&fit=crop",
          rating: 4.7,
          reviews: 987,
          badge: "MỚI",
          type: "beach",
          details: "Check-in Cầu Vàng - Bà Nà Hills|Tắm biển Mỹ Khê|Khám phá Ngũ Hành Sơn & Hội An về đêm"
        },
        {
          title: "Hà Giang - Cao Nguyên Đá Đồng Văn",
          location: "Hà Giang",
          destination: "ha-giang",
          durationLabel: "5 ngày 4 đêm",
          departure: "Hà Nội",
          price: 3890000,
          description: "Vượt đèo Mã Pì Lèng hùng vĩ, chinh phục Cột cờ Lũng Cú nơi địa đầu Tổ quốc và khám phá phố cổ Đồng Văn giữa cao nguyên đá tai mèo",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
          rating: 4.9,
          reviews: 645,
          badge: "SALE",
          type: "adventure",
          details: "Vượt đèo Mã Pì Lèng - sông Nho Quế|Cột cờ Lũng Cú cực Bắc Tổ quốc|Phố cổ Đồng Văn & Dinh vua Mèo"
        }
      ];

      sampleTours.forEach(tour => {
        db.run(
          `INSERT INTO tours (title, location, destination, durationLabel, departure, price, description, image, rating, reviews, badge, type, details)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tour.title, tour.location, tour.destination, tour.durationLabel, tour.departure, tour.price, tour.description, tour.image, tour.rating, tour.reviews, tour.badge, tour.type, tour.details]
        );
      });

      console.log('✨ Sample data inserted');
    }
  });
}

// ===== API ENDPOINTS =====

// 0️⃣ ĐĂNG KÝ TÀI KHOẢN
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ thông tin' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Mật khẩu phải ít nhất 6 ký tự' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, error: 'Mật khẩu không khớp' });
  }

  const emailNormalized = email.trim().toLowerCase();

  db.get('SELECT id FROM users WHERE email = ?', [emailNormalized], (err, existing) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email này đã được đăng ký' });
    }

    const password_hash = hashPassword(password);

    db.run(
      `INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)`,
      [name.trim(), emailNormalized, phone.trim(), password_hash],
      function (err) {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }
        res.json({
          success: true,
          message: 'Đăng ký thành công!',
          user: { id: this.lastID, name: name.trim(), email: emailNormalized, phone: phone.trim() }
        });
      }
    );
  });
});

// 0️⃣ ĐĂNG NHẬP
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ thông tin' });
  }

  const emailNormalized = email.trim().toLowerCase();

  db.get('SELECT * FROM users WHERE email = ?', [emailNormalized], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!user) {
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
    }

    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
    }

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
    });
  });
});

// 0️⃣ LẤY LỊCH SỬ ĐẶT TOUR CỦA 1 USER
app.get('/api/users/:id/bookings', (req, res) => {
  const { id } = req.params;
  db.all(
    `SELECT b.*, t.title as tour_name, t.image, t.location
     FROM bookings b
     JOIN tours t ON b.tour_id = t.id
     WHERE b.user_id = ?
     ORDER BY b.created_at DESC`,
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// 1️⃣ LẤY TẤT CẢ TOURS (kèm rating & số đánh giá THẬT từ bảng reviews)
app.get('/api/tours', (req, res) => {
  db.all(
    `SELECT t.*,
            COALESCE(r.reviewCount, 0) as reviewCount,
            COALESCE(r.avgRating, 0) as avgRating
     FROM tours t
     LEFT JOIN (
       SELECT tour_id, COUNT(*) as reviewCount, AVG(rating) as avgRating
       FROM reviews GROUP BY tour_id
     ) r ON r.tour_id = t.id
     ORDER BY t.id DESC`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        const formattedRows = rows.map(row => ({
          ...row,
          details: row.details ? row.details.split('|') : [],
          avgRating: Math.round(row.avgRating * 10) / 10
        }));
        res.json(formattedRows);
      }
    }
  );
});

// 2️⃣ FILTER TOURS (kèm rating & số đánh giá THẬT từ bảng reviews)
app.get('/api/tours/filter', (req, res) => {
  const { destination, departure, duration, maxPrice } = req.query;

  let query = `
    SELECT t.*,
           COALESCE(r.reviewCount, 0) as reviewCount,
           COALESCE(r.avgRating, 0) as avgRating
    FROM tours t
    LEFT JOIN (
      SELECT tour_id, COUNT(*) as reviewCount, AVG(rating) as avgRating
      FROM reviews GROUP BY tour_id
    ) r ON r.tour_id = t.id
    WHERE 1=1`;
  const params = [];

  if (destination && destination !== '') {
    query += ' AND t.destination = ?';
    params.push(destination);
  }

  if (departure && departure !== '') {
    query += ' AND t.departure = ?';
    params.push(departure);
  }

  if (duration && duration !== '') {
    query += ' AND t.durationLabel = ?';
    params.push(duration);
  }

  if (maxPrice && maxPrice !== '') {
    query += ' AND t.price <= ?';
    params.push(parseFloat(maxPrice));
  }

  query += ' ORDER BY t.id DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const formattedRows = rows.map(row => ({
        ...row,
        details: row.details ? row.details.split('|') : [],
        avgRating: Math.round(row.avgRating * 10) / 10
      }));
      res.json(formattedRows);
    }
  });
});

// 3️⃣ LẤY TOUR THEO ID (kèm rating & số đánh giá THẬT tính từ bảng reviews)
app.get('/api/tours/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tours WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Tour not found' });
    } else {
      db.get(
        'SELECT COUNT(*) as reviewCount, AVG(rating) as avgRating FROM reviews WHERE tour_id = ?',
        [id],
        (err2, stats) => {
          res.json({
            ...row,
            details: row.details ? row.details.split('|') : [],
            reviewCount: stats && stats.reviewCount ? stats.reviewCount : 0,
            avgRating: stats && stats.avgRating ? Math.round(stats.avgRating * 10) / 10 : 0
          });
        }
      );
    }
  });
});

// 3️⃣.1 LẤY DANH SÁCH ĐÁNH GIÁ CỦA 1 TOUR
app.get('/api/tours/:id/reviews', (req, res) => {
  const { id } = req.params;
  db.all(
    `SELECT r.id, r.user_id, r.rating, r.comment, r.created_at, u.name as user_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.tour_id = ?
     ORDER BY r.created_at DESC`,
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// 3️⃣.2 GỬI ĐÁNH GIÁ MỚI CHO 1 TOUR
app.post('/api/reviews', (req, res) => {
  const { tour_id, user_id, rating, comment } = req.body;

  if (!tour_id || !user_id || !rating || !comment || !comment.trim()) {
    return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ đánh giá và bình luận' });
  }

  const ratingNum = parseInt(rating, 10);
  if (ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ success: false, error: 'Số sao phải từ 1 đến 5' });
  }

  db.run(
    `INSERT INTO reviews (tour_id, user_id, rating, comment) VALUES (?, ?, ?, ?)
     ON CONFLICT(tour_id, user_id) DO UPDATE SET
       rating = excluded.rating,
       comment = excluded.comment,
       created_at = CURRENT_TIMESTAMP`,
    [tour_id, user_id, ratingNum, comment.trim()],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: 'Cảm ơn bạn đã đánh giá!', review_id: this.lastID });
    }
  );
});

// 4️⃣ THÊM BOOKING
app.post('/api/bookings', (req, res) => {
  const { name, email, phone, tour_id, adults, children, infants, departure_date, date, user_id } = req.body;

  const soNguoiLon = parseInt(adults, 10) || 1;
  const soTreEm = parseInt(children, 10) || 0;
  const soTreNho = parseInt(infants, 10) || 0;

  if (!name || !email || !phone || !tour_id || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Lấy giá tour
  db.get('SELECT price FROM tours WHERE id = ?', [tour_id], (err, tour) => {
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Người lớn: 100% giá | Trẻ em (2-11 tuổi): 75% giá | Trẻ nhỏ (<2 tuổi): miễn phí
    const total_price =
      tour.price * soNguoiLon +
      tour.price * 0.75 * soTreEm +
      tour.price * 0 * soTreNho;

    db.run(
      `INSERT INTO bookings (name, email, phone, tour_id, adults, children, infants, departure_date, date, total_price, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, tour_id, soNguoiLon, soTreEm, soTreNho, departure_date || null, date, total_price, user_id || null],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({
            success: true,
            booking_id: this.lastID,
            total_price: total_price
          });
        }
      }
    );
  });
});

// 5️⃣ LẤY TẤT CẢ BOOKINGS
app.get('/api/bookings', (req, res) => {
  db.all(
    `SELECT b.*, t.title as tour_name, t.price 
     FROM bookings b
     JOIN tours t ON b.tour_id = t.id
     ORDER BY b.created_at DESC`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// ===== START SERVER =====
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`
      Backend running on http://localhost:${PORT}
  
      Database: tours.db
      Endpoints:
    GET    /api/tours
    GET    /api/tours/filter?destination=ha-long&departure=Hà Nội&maxPrice=3000000
    GET    /api/tours/:id
    
    POST   /api/bookings
    GET    /api/bookings

    GET    /api/tours/:id/reviews
    POST   /api/reviews
  `);
});
