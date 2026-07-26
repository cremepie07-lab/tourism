// Biến global để lưu tours từ API
let allTours = [];

// Hàm fetch tours từ API
async function fetchTours() {
  try {
    const response = await fetch('/api/tours');
    const data = await response.json();
    allTours = data;
    renderTours(allTours);
  } catch (err) {
    console.error('❌ Error fetching tours:', err);
    document.getElementById('toursContainer').innerHTML = 
      '<div class="no-results"><h3>Lỗi kết nối server</h3><p>Vui lòng chắc chắn backend đang chạy</p></div>';
  }
}

// Render tours (giữ nguyên code cũ)
function renderTours(toursToRender) {
  const container = document.getElementById('toursContainer');
  container.innerHTML = '';

  if (toursToRender.length === 0) {
    container.innerHTML = '<div class="no-results"><h3>Không tìm thấy tour phù hợp</h3><p>Thử thay đổi bộ lọc của bạn</p></div>';
    return;
  }

  toursToRender.forEach(tour => {
    const reviewCount = tour.reviewCount || 0;
    const avgRating = tour.avgRating || 0;
    const starsFull = Math.round(avgRating);
    const stars = '★'.repeat(starsFull) + '☆'.repeat(5 - starsFull);
    const ratingHTML = reviewCount > 0
      ? `<div class="tour-rating">
           <span class="stars">${stars}</span>
           <span class="rating-number">${avgRating.toFixed(1)} (${reviewCount} đánh giá)</span>
         </div>`
      : `<div class="tour-rating">
           <span class="rating-number">Chưa có đánh giá</span>
         </div>`;

    const badgeHTML = tour.badge ? `<div class="tour-badge ${tour.badge.toLowerCase() === 'hot' ? 'hot' : ''}">${tour.badge}</div>` : '';

    const card = `
      <div class="tour-card">
        <div class="tour-image">
          <img src="${tour.image}" alt="${tour.title}">
          ${badgeHTML}
        </div>
        <div class="tour-content">
          <div class="tour-location">${tour.location}</div>
          <div class="tour-title">${tour.title}</div>
          <p class="tour-description">${tour.description}</p>
          
          <div class="tour-details">
            <div class="tour-detail-item">📍 Khởi hành: ${tour.departure}</div>
            ${tour.details.map(d => `<div class="tour-detail-item">✓ ${d}</div>`).join('')}
          </div>

          ${ratingHTML}

          <div class="tour-footer">
            <div class="tour-price">
              <span class="tour-price-label">Giá từ:</span>
              <span class="tour-price-value">${tour.price.toLocaleString('vi-VN')}đ<small>/ người</small></span>
            </div>
            <button class="btn-booking" onclick="viewTourDetail(${tour.id})">Đặt Ngay</button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// Redirect to tour detail page
function viewTourDetail(tourId) {
  window.location.href = `chi_tiet_tour.html?id=${tourId}`;
}

// Apply filters (SỬA ĐỔI - gọi API filter)
async function applyFilters() {
  const destination = document.getElementById('sidebarDestination').value;
  const maxPrice = document.getElementById('priceRange').value;
  
  // Get selected departures
  const departures = [];
  const departureCheckboxes = document.querySelectorAll('#departureGroup input[type="checkbox"]:checked');
  departureCheckboxes.forEach(cb => {
    departures.push(cb.value);
  });

  // Get selected durations
  const durations = [];
  const durationCheckboxes = document.querySelectorAll('#durationGroup input[type="checkbox"]:checked');
  durationCheckboxes.forEach(cb => {
    durations.push(cb.value);
  });

  try {
    // Gọi API filter
    let url = '/api/tours/filter?';
    if (destination) url += `destination=${destination}&`;
    if (maxPrice) url += `maxPrice=${maxPrice}&`;

    const response = await fetch(url);
    let filtered = await response.json();

    // Client-side filter cho departure và duration
    if (departures.length > 0) {
      filtered = filtered.filter(tour => departures.includes(tour.departure));
    }

    if (durations.length > 0) {
      filtered = filtered.filter(tour => durations.includes(tour.durationLabel));
    }

    renderTours(filtered);
    updateMaxPrice();
  } catch (err) {
    console.error('❌ Error filtering tours:', err);
  }
}

// Toggle filter group
function toggleFilterGroup(element) {
  element.classList.toggle('collapsed');
  const group = element.nextElementSibling;
  if (group && group.classList.contains('filter-group')) {
    group.classList.toggle('collapsed');
  }
}

// Update price display
function updateMaxPrice() {
  const priceRange = document.getElementById('priceRange');
  const maxPriceSpan = document.getElementById('maxPrice');
  const value = parseFloat(priceRange.value);
  maxPriceSpan.textContent = value.toLocaleString('vi-VN');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const priceRange = document.getElementById('priceRange');
  
  // Fetch tours từ API khi trang load
  fetchTours();

  priceRange.addEventListener('input', function() {
    updateMaxPrice();
    applyFilters();
  });

  // Update max price display on load
  updateMaxPrice();
});

// Khi quay lại trang bằng nút Back/Forward, trình duyệt có thể phục hồi
// trang từ bộ nhớ đệm (bfcache) mà KHÔNG chạy lại JS -> dữ liệu tour
// (đặc biệt rating/reviewCount vừa cập nhật) sẽ bị cũ. Refetch lại khi đó.
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    fetchTours();
  }
});
