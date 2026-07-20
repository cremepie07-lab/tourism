const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
        guests INTEGER DEFAULT 1,
        date TEXT NOT NULL,
        total_price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id)
      )
    `, () => {
      console.log('📊 Database tables ready');
      insertSampleData();
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
          title: "Vịnh Hạ Long - Kỳ Quan Thiên Nhiên",
          location: "Quảng Ninh",
          destination: "ha-long",
          durationLabel: "3 ngày 2 đêm",
          departure: "Hà Nội",
          price: 2500000,
          description: "Khám phá hàng nghìn đảo đá vôi hùng vĩ trên mặt biển xanh ngọc",
          image: "https://images.unsplash.com/photo-1559627717-bdb2d005a87e?q=80&w=735&auto=format&fit=crop",
          rating: 4.8,
          reviews: 1245,
          badge: "HOT",
          type: "beach",
          details: "Cruise 2 đêm|Bao ăn sáng|Hướng dẫn viên"
        },
        {
          title: "Phố Cổ Hội An - Hành Trình Lịch Sử",
          location: "Quảng Nam",
          destination: "hoi-an",
          durationLabel: "2 ngày 1 đêm",
          departure: "Đà Nẵng",
          price: 1800000,
          description: "Đi bộ qua những con phố cổ kính, khám phá kiến trúc trăm năm tuổi",
          image: "https://images.unsplash.com/photo-1526139334526-f591a54b477c?q=80&w=1170&auto=format&fit=crop",
          rating: 4.7,
          reviews: 892,
          badge: "BESTSELLER",
          type: "culture",
          details: "2 ngày 1 đêm|Nấu ăn cùng địa phương|Chèo thuyền"
        },
        {
          title: "Sapa - Thiên Đường Ruộng Bậc Thang",
          location: "Lào Cai",
          destination: "sapa",
          durationLabel: "4 ngày 3 đêm",
          departure: "Hà Nội",
          price: 2100000,
          description: "Trekking qua ruộng bậc thang xanh mướt, gặp gỡ người dân dân tộc",
          image: "https://images.unsplash.com/photo-1570366583862-f91883984fde?q=80&w=2071&auto=format&fit=crop",
          rating: 4.9,
          reviews: 1567,
          badge: "HOT",
          type: "adventure",
          details: "4 ngày 3 đêm|Trekking hàng ngày|Ở nhà dân tộc"
        },
        {
          title: "Cố Đô Huế - Vẻ Đẹp Hoàng Gia",
          location: "Thừa Thiên Huế",
          destination: "hue",
          durationLabel: "2 ngày 1 đêm",
          departure: "Đà Nẵng",
          price: 1600000,
          description: "Thăm Citadel, Lăng tẩm và thưởng thức ẩm thực cung đình tinh tế",
          image: "https://media.istockphoto.com/id/1215379425/vi/anh/cung-%C4%91i%E1%BB%87n-hu%E1%BA%BF-v%C3%A0-l%C4%83ng-m%E1%BB%99-ho%C3%A0ng-gia-vi%E1%BB%87t-nam.jpg?s=612x612&w=0&k=20&c=wDzMfVagXOCEPF-Jb-9J12hYkUKJtV8KKUlNQ4WDVao=",
          rating: 4.6,
          reviews: 734,
          badge: "BESTSELLER",
          type: "culture",
          details: "2 ngày 1 đêm|Ẩm thực cung đình|Hướng dẫn có kinh nghiệm"
        },
        {
          title: "Phú Quốc - Thiên Đường Đảo Ngọc",
          location: "Kiên Giang",
          destination: "phu-quoc",
          durationLabel: "4 ngày 3 đêm",
          departure: "Hồ Chí Minh",
          price: 2800000,
          description: "Bãi biển cát trắng, nước biển trong xanh, hoàng hôn tuyệt đẹp",
          image: "https://images.unsplash.com/photo-1704765707896-f0aaab64d7b2?q=80&w=1387&auto=format&fit=crop",
          rating: 4.8,
          reviews: 1456,
          badge: "BESTSELLER",
          type: "beach",
          details: "4 ngày 3 đêm|Snorkeling & Diving|Khách sạn 4 sao"
        },
        {
          title: "Hà Nội - Thủ Đô Văn Hiến",
          location: "Hà Nội",
          destination: "hanoi",
          durationLabel: "Đi trong ngày",
          departure: "Hà Nội",
          price: 1200000,
          description: "Khám phá cổ kính của Hà Nội, từ phố cổ đến Hồ Hoàn Kiếm",
          image: "https://images.unsplash.com/photo-1679562078540-09ae866ef4bf?q=80&w=735&auto=format&fit=crop",
          rating: 4.5,
          reviews: 1123,
          badge: "",
          type: "culture",
          details: "2 ngày 1 đêm|Phố cổ & Hồ Hoàn Kiếm|Nếm phở truyền thống"
        },
        {
          title: "Đà Nẵng - Điểm Dừng Chân Hoàn Hảo",
          location: "Đà Nẵng",
          destination: "da-nang",
          durationLabel: "4 ngày 3 đêm",
          departure: "Đà Nẵng",
          price: 2200000,
          description: "Biển Mỹ Khê, Cầu Vàng, và núi Bà Nà tuyệt vời",
          image: "https://images.unsplash.com/photo-1684784784123-0854fc0eec25?q=80&w=687&auto=format&fit=crop",
          rating: 4.7,
          reviews: 987,
          badge: "HOT",
          type: "beach",
          details: "4 ngày 3 đêm|Cầu Vàng & Bà Nà|Biển Mỹ Khê"
        },
        {
          title: "Hà Giang - Trekking Miền Núi",
          location: "Hà Giang",
          destination: "ha-giang",
          durationLabel: "5 ngày 4 đêm",
          departure: "Hà Nội",
          price: 3500000,
          description: "Chinh phục Mã Pì Lèng, Yên Minh qua những con đường trekking huyền diệu",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
          rating: 4.9,
          reviews: 645,
          badge: "HOT",
          type: "adventure",
          details: "7 ngày 6 đêm|Trekking khó|Ở nhà dân tộc"
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

// 1️⃣ LẤY TẤT CẢ TOURS
app.get('/api/tours', (req, res) => {
  db.all('SELECT * FROM tours ORDER BY id DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Convert details string back to array
      const formattedRows = rows.map(row => ({
        ...row,
        details: row.details ? row.details.split('|') : []
      }));
      res.json(formattedRows);
    }
  });
});

// 2️⃣ FILTER TOURS
app.get('/api/tours/filter', (req, res) => {
  const { destination, departure, duration, maxPrice } = req.query;

  let query = 'SELECT * FROM tours WHERE 1=1';
  const params = [];

  if (destination && destination !== '') {
    query += ' AND destination = ?';
    params.push(destination);
  }

  if (departure && departure !== '') {
    query += ' AND departure = ?';
    params.push(departure);
  }

  if (duration && duration !== '') {
    query += ' AND durationLabel = ?';
    params.push(duration);
  }

  if (maxPrice && maxPrice !== '') {
    query += ' AND price <= ?';
    params.push(parseFloat(maxPrice));
  }

  query += ' ORDER BY id DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const formattedRows = rows.map(row => ({
        ...row,
        details: row.details ? row.details.split('|') : []
      }));
      res.json(formattedRows);
    }
  });
});

// 3️⃣ LẤY TOUR THEO ID
app.get('/api/tours/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tours WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Tour not found' });
    } else {
      res.json({
        ...row,
        details: row.details ? row.details.split('|') : []
      });
    }
  });
});

// 4️⃣ THÊM BOOKING
app.post('/api/bookings', (req, res) => {
  const { name, email, phone, tour_id, guests, date } = req.body;

  if (!name || !email || !phone || !tour_id || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Lấy giá tour
  db.get('SELECT price FROM tours WHERE id = ?', [tour_id], (err, tour) => {
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    const total_price = tour.price * guests;

    db.run(
      `INSERT INTO bookings (name, email, phone, tour_id, guests, date, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, tour_id, guests, date, total_price],
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
  `);
});
