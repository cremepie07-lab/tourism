tool: node.js + database:sqlite
chạy trên terminal: bước 1: nhập cd backend
                    bước 2: nhập node server.js
                    kết quả:
                    
PS D:\tourism-main> cd backend
PS D:\tourism-main\backend> node server.js
📁 Đang serve frontend từ: D:\tourism-main\frontend
📁 Thư mục này có tồn tại không? true
📁 Danh sách file trong đó: [
  'auth.html',
  'auth.js',
  'auth_form.js',
  'auth_style.css',
  'chi_tiet_tour.html',
  'chi_tiet_tour.js',
  'dat_tour.html',
  'main.js',
  'script_tour.js',
  'style.css'
]

      Backend running on port 5000
  
      Database: tours.db
      Endpoints:
    GET    /api/tours
    GET    /api/tours/filter?destination=ha-long&departure=Hà Nội&maxPrice=3000000
    GET    /api/tours/:id
    
    POST   /api/bookings
    GET    /api/bookings

    GET    /api/tours/:id/reviews
    POST   /api/reviews
  
✅ Connected to SQLite database
📊 Database tables ready (bookings schema up to date)
📊 Reviews table ready (unique per user/tour)

**********link để vào sau khi chạy terminal: http://localhost:5000/auth.html
