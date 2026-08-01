const itineraryByDestination = {
      'ha-long': [
        {
          dayNum: "Ngày 1", title: "Hà Nội - Hạ Long - Du thuyền ngắm hoàng hôn",
          meals: "Ăn trưa, tối", img: "https://images.unsplash.com/photo-1559627717-bdb2d005a87e?q=80&w=600",
          activitiesTitle: "Lênh đênh trên Vịnh Di sản",
          bullets: [
            "Khởi hành từ Hà Nội, lên du thuyền và bắt đầu hành trình khám phá <b>Vịnh Hạ Long</b>.",
            "Tham quan <b>Hang Sửng Sốt</b>, chèo thuyền kayak giữa những đảo đá vôi kỳ vĩ.",
            "Ngắm hoàng hôn trên boong tàu, dùng bữa tối hải sản và nghỉ đêm trên du thuyền."
          ]
        },
        {
          dayNum: "Ngày 2", title: "Đảo Titop - Làng chài Cửa Vạn - Hà Nội",
          meals: "Ăn sáng, trưa", img: "https://images.unsplash.com/photo-1559627717-bdb2d005a87e?q=80&w=600",
          activitiesTitle: "Chinh phục đỉnh Titop",
          bullets: [
            "Tập Thái Cực Quyền đón bình minh trên vịnh, ăn sáng nhẹ.",
            "Leo núi Titop ngắm toàn cảnh vịnh, tắm biển tại bãi cát trắng.",
            "Ghé thăm làng chài Cửa Vạn, trả phòng và khởi hành về Hà Nội."
          ]
        }
      ],
      'sapa': [
        {
          dayNum: "Ngày 1", title: "Hà Nội - Sapa - Bản Cát Cát",
          meals: "Ăn trưa, tối", img: "https://images.unsplash.com/photo-1570366583862-f91883984fde?q=80&w=600",
          activitiesTitle: "Chạm vào bản sắc Tây Bắc",
          bullets: [
            "Di chuyển lên Sapa, nhận phòng nghỉ ngơi giữa không khí se lạnh vùng cao.",
            "Trekking xuống <b>Bản Cát Cát</b>, tìm hiểu văn hoá người H'Mông.",
            "Dạo chợ đêm Sapa, thưởng thức đặc sản thắng cố, lợn cắp nách."
          ]
        },
        {
          dayNum: "Ngày 2", title: "Fansipan - Ruộng bậc thang Mường Hoa",
          meals: "Ăn sáng, trưa", img: "https://images.unsplash.com/photo-1570366583862-f91883984fde?q=80&w=600",
          activitiesTitle: "Nóc nhà Đông Dương",
          bullets: [
            "Chinh phục <b>đỉnh Fansipan</b> bằng cáp treo, ngắm biển mây kỳ ảo.",
            "Trekking qua thung lũng <b>Mường Hoa</b>, chiêm ngưỡng ruộng bậc thang xanh mướt."
          ]
        },
        {
          dayNum: "Ngày 3-4", title: "Bản Tả Van - Thác Bạc - Hà Nội",
          meals: "Ăn sáng, trưa, tối", img: "https://images.unsplash.com/photo-1570366583862-f91883984fde?q=80&w=600",
          activitiesTitle: "Thiên nhiên hoang sơ Tây Bắc",
          bullets: [
            "Ghé thăm <b>Thác Bạc</b>, chinh phục cổng trời hùng vĩ.",
            "Trải nghiệm ở lại nhà dân tộc tại bản Tả Van, giao lưu văn nghệ.",
            "Trả phòng, khởi hành về Hà Nội, kết thúc hành trình."
          ]
        }
      ],
      'hoi-an': [
        {
          dayNum: "Ngày 1", title: "Đà Nẵng - Phố cổ Hội An",
          meals: "Ăn trưa, tối", img: "https://images.unsplash.com/photo-1526139334526-f591a54b477c?q=80&w=600",
          activitiesTitle: "Dạo bước phố cổ trăm năm",
          bullets: [
            "Tham quan <b>Chùa Cầu</b>, Hội quán Phúc Kiến và các ngôi nhà cổ kính.",
            "Học nấu món ăn địa phương cùng người dân Hội An.",
            "Buổi tối thả đèn hoa đăng trên sông Hoài lung linh sắc màu."
          ]
        },
        {
          dayNum: "Ngày 2", title: "Rừng dừa Bảy Mẫu - Làng gốm Thanh Hà",
          meals: "Ăn sáng, trưa", img: "https://images.unsplash.com/photo-1526139334526-f591a54b477c?q=80&w=600",
          activitiesTitle: "Trải nghiệm làng nghề truyền thống",
          bullets: [
            "Chèo thuyền thúng khám phá <b>Rừng dừa Bảy Mẫu</b>.",
            "Ghé <b>Làng gốm Thanh Hà</b>, tự tay làm sản phẩm gốm lưu niệm.",
            "Trả phòng, di chuyển về lại Đà Nẵng."
          ]
        }
      ],
      'hue': [
        {
          dayNum: "Ngày 1", title: "Đà Nẵng - Đại Nội Huế - Chùa Thiên Mụ",
          meals: "Ăn trưa, tối", img: "https://media.istockphoto.com/id/1215379425/vi/anh/cung-%C4%91i%E1%BB%87n-hu%E1%BA%BF-v%C3%A0-l%C4%83ng-m%E1%BB%99-ho%C3%A0ng-gia-vi%E1%BB%87t-nam.jpg?s=612x612&w=0&k=20&c=wDzMfVagXOCEPF-Jb-9J12hYkUKJtV8KKUlNQ4WDVao=",
          activitiesTitle: "Dấu ấn kinh thành cổ",
          bullets: [
            "Tham quan <b>Đại Nội Huế</b>, tìm hiểu lịch sử triều Nguyễn.",
            "Ghé <b>Chùa Thiên Mụ</b> bên dòng sông Hương thơ mộng.",
            "Dùng bữa tối cung đình, nghe ca Huế trên thuyền rồng."
          ]
        },
        {
          dayNum: "Ngày 2", title: "Lăng Khải Định - Chợ Đông Ba - Đà Nẵng",
          meals: "Ăn sáng, trưa", img: "https://media.istockphoto.com/id/1215379425/vi/anh/cung-%C4%91i%E1%BB%87n-hu%E1%BA%BF-v%C3%A0-l%C4%83ng-m%E1%BB%99-ho%C3%A0ng-gia-vi%E1%BB%87t-nam.jpg?s=612x612&w=0&k=20&c=wDzMfVagXOCEPF-Jb-9J12hYkUKJtV8KKUlNQ4WDVao=",
          activitiesTitle: "Kiến trúc lăng tẩm độc đáo",
          bullets: [
            "Khám phá kiến trúc Á - Âu độc đáo của <b>Lăng Khải Định</b>.",
            "Mua sắm đặc sản tại <b>Chợ Đông Ba</b>, thưởng thức bún bò Huế trứ danh.",
            "Khởi hành trở về Đà Nẵng."
          ]
        }
      ],
      'phu-quoc': [
        {
          dayNum: "Ngày 1", title: "TP.HCM - Phú Quốc - Bãi Sao",
          meals: "Ăn trưa, tối", img: "https://images.unsplash.com/photo-1704765707896-f0aaab64d7b2?q=80&w=600",
          activitiesTitle: "Thiên đường biển đảo",
          bullets: [
            "Bay đến Phú Quốc, nhận phòng khách sạn 4 sao gần biển.",
            "Tắm biển và thư giãn tại <b>Bãi Sao</b> cát trắng nước trong.",
            "Ăn tối hải sản tươi sống tại chợ đêm Dinh Cậu."
          ]
        },
        {
          dayNum: "Ngày 2", title: "Snorkeling - Cáp treo Hòn Thơm",
          meals: "Ăn sáng, trưa", img: "https://images.unsplash.com/photo-1704765707896-f0aaab64d7b2?q=80&w=600",
          activitiesTitle: "Khám phá đại dương",
          bullets: [
            "Trải nghiệm <b>snorkeling</b> ngắm san hô tại quần đảo An Thới.",
            "Đi <b>cáp treo Hòn Thơm</b> - cáp treo vượt biển dài nhất thế giới."
          ]
        },
        {
          dayNum: "Ngày 3-4", title: "VinWonders - Grand World - TP.HCM",
          meals: "Ăn sáng, trưa, tối", img: "https://images.unsplash.com/photo-1704765707896-f0aaab64d7b2?q=80&w=600",
          activitiesTitle: "Vui chơi giải trí bất tận",
          bullets: [
            "Vui chơi tại <b>VinWonders</b> và ngắm hoàng hôn ở <b>Grand World</b>.",
            "Tự do mua sắm quà lưu niệm, trả phòng và bay về TP.HCM."
          ]
        }
      ],
      'hanoi': [
        {
          dayNum: "Ngày 1", title: "Phố cổ Hà Nội - Hồ Hoàn Kiếm",
          meals: "Ăn trưa", img: "https://images.unsplash.com/photo-1679562078540-09ae866ef4bf?q=80&w=600",
          activitiesTitle: "Nét cổ kính giữa lòng thủ đô",
          bullets: [
            "Dạo bước <b>36 phố phường</b>, tham quan Đền Ngọc Sơn bên Hồ Hoàn Kiếm.",
            "Thưởng thức phở, bún chả và cà phê trứng đặc trưng Hà Nội.",
            "Xem múa rối nước tại Nhà hát Múa rối Thăng Long."
          ]
        }
      ],
      'da-nang': [
        {
          dayNum: "Ngày 1", title: "Bà Nà Hills - Cầu Vàng",
          meals: "Ăn trưa, tối", img: "https://images.unsplash.com/photo-1684784784123-0854fc0eec25?q=80&w=600",
          activitiesTitle: "Chạm mây trên đỉnh Bà Nà",
          bullets: [
            "Đi cáp treo lên <b>Bà Nà Hills</b>, check-in <b>Cầu Vàng</b> nổi tiếng.",
            "Tham quan Làng Pháp, Vườn hoa Le Jardin D'Amour.",
            "Ăn tối buffet tại Bà Nà, ngắm hoàng hôn trên đỉnh núi."
          ]
        },
        {
          dayNum: "Ngày 2", title: "Biển Mỹ Khê - Bán đảo Sơn Trà",
          meals: "Ăn sáng, trưa", img: "https://images.unsplash.com/photo-1684784784123-0854fc0eec25?q=80&w=600",
          activitiesTitle: "Sắc xanh biển đảo",
          bullets: [
            "Tắm biển tại <b>bãi biển Mỹ Khê</b> - một trong những bãi biển đẹp nhất hành tinh.",
            "Chinh phục <b>Bán đảo Sơn Trà</b>, viếng chùa Linh Ứng."
          ]
        },
        {
          dayNum: "Ngày 3", title: "Ngũ Hành Sơn - Phố cổ Hội An về đêm",
          meals: "Ăn sáng, trưa", img: "https://images.unsplash.com/photo-1526139334526-f591a54b477c?q=80&w=600",
          activitiesTitle: "Giao thoa núi đá và phố cổ",
          bullets: [
            "Khám phá <b>Ngũ Hành Sơn</b>, chiêm ngưỡng hang động và tượng Phật cổ.",
            "Dạo phố cổ Hội An lung linh ánh đèn lồng về đêm, thả hoa đăng trên sông Hoài.",
            "Trả phòng, kết thúc hành trình khám phá Đà Nẵng."
          ]
        }
      ],
      'ha-giang': [
        {
          dayNum: "Ngày 1-2", title: "Hà Nội - Hà Giang - Cột cờ Lũng Cú",
          meals: "Ăn trưa, tối", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600",
          activitiesTitle: "Chạm tới cực Bắc Tổ quốc",
          bullets: [
            "Vượt <b>Đèo Mã Pì Lèng</b> hùng vĩ, ngắm sông Nho Quế xanh ngọc.",
            "Chinh phục <b>Cột cờ Lũng Cú</b> - điểm cực Bắc thiêng liêng của Tổ quốc."
          ]
        },
        {
          dayNum: "Ngày 3", title: "Phố cổ Đồng Văn - Dinh vua Mèo",
          meals: "Ăn sáng, trưa, tối", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600",
          activitiesTitle: "Dấu tích cao nguyên đá",
          bullets: [
            "Tham quan <b>Dinh thự vua Mèo</b> kiến trúc độc đáo giữa cao nguyên đá.",
            "Dạo <b>Phố cổ Đồng Văn</b> về đêm, thưởng thức thắng cố, rượu ngô."
          ]
        },
        {
          dayNum: "Ngày 4-5", title: "Yên Minh - Quản Bạ - Hà Nội",
          meals: "Ăn sáng, trưa", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600",
          activitiesTitle: "Trekking cao nguyên đá",
          bullets: [
            "Trekking qua rừng thông <b>Yên Minh</b>, chiêm ngưỡng Cổng Trời Quản Bạ.",
            "Ghé <b>Núi Đôi Cô Tiên</b>, khởi hành về lại Hà Nội."
          ]
        }
      ]
    };

    const highlightsByDestination = {
      'ha-long': 'Vịnh Hạ Long, Hang Sửng Sốt, Đảo Titop, Làng chài Cửa Vạn',
      'sapa': 'Bản Cát Cát, Đỉnh Fansipan, Thung lũng Mường Hoa, Thác Bạc',
      'hoi-an': 'Phố cổ Hội An, Chùa Cầu, Rừng dừa Bảy Mẫu, Làng gốm Thanh Hà',
      'hue': 'Đại Nội Huế, Chùa Thiên Mụ, Lăng Khải Định, Chợ Đông Ba',
      'phu-quoc': 'Bãi Sao, Quần đảo An Thới, Cáp treo Hòn Thơm, VinWonders',
      'hanoi': 'Phố cổ Hà Nội, Hồ Hoàn Kiếm, Đền Ngọc Sơn, Văn Miếu',
      'da-nang': 'Bà Nà Hills, Cầu Vàng, Biển Mỹ Khê, Bán đảo Sơn Trà',
      'ha-giang': 'Đèo Mã Pì Lèng, Cột cờ Lũng Cú, Phố cổ Đồng Văn, Cao nguyên đá'
    };

    const defaultInfoByDestination = {
      'ha-long': {
        cuisine: 'Hải sản tươi sống, chả mực, sam biển',
        ideal_time: 'Mùa hè (tháng 5 - 9)',
        transport: 'Xe du lịch + du thuyền 4 sao',
        promotion: 'Giảm 5% khi đặt trước 30 ngày'
      },
      'sapa': {
        cuisine: 'Thắng cố, lợn cắp nách, cá hồi vùng cao',
        ideal_time: 'Tháng 9 - 11 (mùa lúa chín)',
        transport: 'Xe du lịch + cáp treo Fansipan',
        promotion: 'Miễn phí 1 trẻ em khi đặt 2 người lớn'
      },
      'hoi-an': {
        cuisine: 'Cao lầu, mì Quảng, bánh bao bánh vạc',
        ideal_time: 'Tháng 2 - 4, 8 - 10',
        transport: 'Xe du lịch + thuyền trên sông Hoài',
        promotion: 'Tặng 1 đêm khách sạn 4 sao'
      },
      'hue': {
        cuisine: 'Bún bò Huế, cơm hến, chè cung đình',
        ideal_time: 'Tháng 1 - 4',
        transport: 'Xe du lịch + thuyền rồng sông Hương',
        promotion: 'Giảm 8% khi đặt nhóm 4+ người'
      },
      'phu-quoc': {
        cuisine: 'Hải sản tươi sống, gỏi cá trích, bún quậy',
        ideal_time: 'Tháng 11 - 4 (mùa khô)',
        transport: 'Máy bay + xe đưa đón khách sạn',
        promotion: 'Tặng 1 đêm nghỉ dưỡng'
      },
      'hanoi': {
        cuisine: 'Phở, bún chả, chả cá Lã Vọng, cà phê trứng',
        ideal_time: 'Tháng 9 - 11, 3 - 4',
        transport: 'Xe du lịch + đi bộ khám phá phố cổ',
        promotion: 'Tặng nón lá + nước uống'
      },
      'da-nang': {
        cuisine: 'Bánh xèo, mì Quảng, hải sản biển Mỹ Khê',
        ideal_time: 'Tháng 2 - 8',
        transport: 'Xe du lịch + cáp treo Bà Nà',
        promotion: 'Giảm 10% khi đặt online'
      },
      'ha-giang': {
        cuisine: 'Thắng cố, mèn mén, rượu ngô Đồng Văn',
        ideal_time: 'Tháng 10 - 12 (mùa hoa tam giác mạch)',
        transport: 'Xe du lịch 4x4 leo đèo',
        promotion: 'Tặng bảo hiểm du lịch cao cấp'
      }
    };

    let activeTour = null;
    let activeItinerary = [];

    function getTourIdFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get('id') || 1;
    }

    async function loadTourDetail() {
      const tourId = getTourIdFromUrl();
      try {
        const res = await fetch(`/api/tours/${tourId}`);
        if (!res.ok) throw new Error('Tour not found');
        const tour = await res.json();
        activeTour = tour;
        activeItinerary = (tour.itinerary && tour.itinerary.length) ? tour.itinerary : (itineraryByDestination[tour.destination] || []);
        renderTourDetail();
      } catch (err) {
        console.error('❌ Error loading tour detail:', err);
        document.getElementById('detailTitle').innerText = 'Không tải được thông tin tour';
        document.getElementById('infoDest').innerText = 'Vui lòng thử tải lại trang, hoặc kiểm tra backend đang chạy.';
      }
    }

    function renderTourDetail() {
      const t = activeTour;
      document.title = `${t.title} - Việt Nam Hành Trình Huyền Diệu`;
      document.getElementById("detailId").innerText = `Mã Tour: TOUR-${String(t.id).padStart(4, '0')}`;
      document.getElementById("detailTitle").innerText = t.title;
      const di = defaultInfoByDestination[t.destination] || {};
      document.getElementById("infoDest").innerText = t.highlights || highlightsByDestination[t.destination] || t.location;
      document.getElementById('infoCuisine').innerText = t.cuisine || di.cuisine || 'Buffet sáng, Thực đơn đặc sản phong phú';
      document.getElementById('infoIdealTime').innerText = t.ideal_time || di.ideal_time || 'Quanh năm (Mỗi mùa một vẻ đẹp đặc trưng riêng)';
      document.getElementById('infoTransport').innerText = t.transport || di.transport || 'Xe du lịch đời mới chỗ ngồi êm ái suốt tuyến';
      document.getElementById('infoPromotion').innerText = t.promotion || di.promotion || 'Theo các chương trình ưu đãi hiện hành của công ty';

      const avg = t.avgRating || 0;
      const count = t.reviewCount || 0;
      const starsFull = Math.round(avg);
      document.getElementById('quickRating').innerHTML = `
        <span class="stars">${'★'.repeat(starsFull)}${'☆'.repeat(5 - starsFull)}</span>
        <span>${count > 0 ? `${avg.toFixed(1)} (${count} đánh giá)` : 'Chưa có đánh giá'}</span>
      `;

      const galleryImgs = Array.isArray(t.images) && t.images.length ? t.images : (t.image ? [t.image] : []);
      const mainGalleryImg = document.getElementById('mainGalleryImg');
      mainGalleryImg.src = galleryImgs[0] || t.image;
      mainGalleryImg.alt = t.title;

      const sub1 = document.getElementById('subGalleryImg1');
      const sub2 = document.getElementById('subGalleryImg2');
      const subEls = [sub1, sub2];
      galleryImgs.slice(1, 3).forEach((src, i) => {
        const el = subEls[i];
        el.src = src;
        el.style.display = '';
        el.onclick = () => swapMainGallery(el.src, el);
      });
      if (galleryImgs.length < 2 && activeItinerary[0]) { sub1.src = activeItinerary[0].img; sub1.onclick = null; }
      if (galleryImgs.length < 3 && activeItinerary[1]) { sub2.src = activeItinerary[1].img; sub2.onclick = null; }

      const groupContainer = document.getElementById("itineraryGroup");
      groupContainer.innerHTML = '';
      if (activeItinerary.length === 0) {
        groupContainer.innerHTML = `<p style="color:var(--text-muted);">Lịch trình chi tiết đang được cập nhật. Điểm nổi bật: ${t.details.join(', ')}.</p>`;
      } else {
        activeItinerary.forEach((d, index) => {
          groupContainer.innerHTML += `
            <div class="itinerary-accordion-item">
              <button class="itinerary-header-btn" onclick="openItineraryDay(${index})">
                <div>
                  <div class="itinerary-header-title">${d.dayNum}: ${d.title}</div>
                  <div class="itinerary-header-meals">🍴 (${d.meals})</div>
                </div>
                <span class="arrow-icon">➔</span>
              </button>
            </div>
          `;
        });
      }

      document.querySelectorAll('.pax-row').forEach(row => {
        const percent = parseFloat(row.dataset.percent);
        const type = row.dataset.type;
        const price = Math.round(t.price * percent);
        const priceEl = document.getElementById('price' + capitalize(type));
        if (percent > 0) {
          priceEl.innerText = 'x ' + price.toLocaleString('vi-VN') + 'đ';
        }
      });
      computeTotal();

      const dateInput = document.getElementById('departureDate');
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
      selectedDate = today;

      loadReviews(t.id);
    }

    function prefillCustomerInfo() {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      try {
        const user = JSON.parse(userStr);
        const nameEl = document.getElementById('cusName');
        const phoneEl = document.getElementById('cusPhone');
        const emailEl = document.getElementById('cusEmail');
        if (nameEl && user.name) nameEl.value = user.name;
        if (phoneEl && user.phone) phoneEl.value = user.phone;
        if (emailEl && user.email) emailEl.value = user.email;
      } catch (e) {
        console.error('Không đọc được thông tin user:', e);
      }
    }

    document.addEventListener("DOMContentLoaded", loadTourDetail);
    document.addEventListener("DOMContentLoaded", prefillCustomerInfo);

    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        loadTourDetail();
      }
    });

    let selectedDate = "";
    const paxCounts = { adult: 1, child: 0, infant: 0 };

    function capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function onDateChange() {
      selectedDate = document.getElementById('departureDate').value;
    }

    function changePax(type, delta) {
      const min = type === 'adult' ? 1 : 0;
      const newVal = paxCounts[type] + delta;
      if (newVal < min || newVal > 15) return;
      paxCounts[type] = newVal;
      document.getElementById('count' + capitalize(type)).innerText = newVal;
      computeTotal();
    }

    function computeTotal() {
      if (!activeTour) return;
      let total = 0;
      document.querySelectorAll('.pax-row').forEach(row => {
        const type = row.dataset.type;
        const percent = parseFloat(row.dataset.percent);
        const price = Math.round(activeTour.price * percent);
        total += price * paxCounts[type];
      });
      document.getElementById('calcTotal').innerText = total.toLocaleString('vi-VN') + "đ";
    }

    function swapMainGallery(src, thumbEl) {
      const main = document.getElementById('mainGalleryImg');
      const old = main.src;
      main.src = src;
      if (thumbEl) thumbEl.src = old;
    }

    function openItineraryDay(index) {
      const data = activeItinerary[index];
      const body = document.getElementById("modalDynamicBody");
      let bulletHtml = data.bullets.map(b => `<li>${b}</li>`).join('');

      body.innerHTML = `
        <div class="modal-day-banner">
          <div class="modal-day-info">
            <div class="modal-day-num">${data.dayNum}</div>
            <div class="modal-day-title">${data.title}</div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-top:5px;">🍴 ${data.meals}</div>
          </div>
          <img src="${data.img}" class="modal-day-img" alt="Hình ảnh ngày">
        </div>

        <div class="modal-timeline-content">
          <div class="modal-timeline-dot"></div>
          <div class="modal-section-title">Hoạt động chính: ${data.activitiesTitle}</div>
          <ul class="activities-list">${bulletHtml}</ul>
        </div>
        <div class="note-box">
          <b>Lưu ý:</b> Thứ tự các điểm tham quan có thể thay đổi để phù hợp với thời tiết thực tế nhưng vẫn đảm bảo đủ điểm.
        </div>
      `;
      document.getElementById("itineraryModal").style.display = "flex";
    }

    function closeModal() {
      document.getElementById("itineraryModal").style.display = "none";
    }

    async function handleOrder(e) {
      e.preventDefault();
      if (!activeTour) return;

      const userStr = localStorage.getItem('user');
      const loggedInUser = userStr ? JSON.parse(userStr) : null;

      const payload = {
        name: document.getElementById("cusName").value,
        email: document.getElementById("cusEmail").value,
        phone: document.getElementById("cusPhone").value,
        tour_id: activeTour.id,
        adults: paxCounts.adult,
        children: paxCounts.child,
        infants: paxCounts.infant,
        departure_date: selectedDate,
        date: selectedDate,
        user_id: loggedInUser ? loggedInUser.id : null  
      };

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
          alert(`Đăng ký thành công!\nTour: ${activeTour.title}\nNgày khởi hành: ${selectedDate}\nNgười lớn: ${paxCounts.adult} - Trẻ em: ${paxCounts.child} - Trẻ nhỏ: ${paxCounts.infant}\nTổng tiền: ${data.total_price.toLocaleString('vi-VN')}đ\nĐội ngũ tư vấn sẽ liên hệ qua SĐT: ${payload.phone} hoặc Email: ${payload.email}.`);
        } else {
          alert('Có lỗi xảy ra, vui lòng thử lại: ' + (data.error || ''));
        }
      } catch (err) {
        console.error('❌ Error saving booking:', err);
        alert('Không kết nối được server. Vui lòng chắc chắn backend đang chạy.');
      }
    }

    let selectedStarRating = 0;

    async function setupReviewForm(tourId) {
      const userStr = localStorage.getItem('user');
      const writeCard = document.getElementById('writeReviewCard');
      const loginPrompt = document.getElementById('loginToReview');
      const notEligible = document.getElementById('reviewNotEligible');

      const starPicker = document.getElementById('starPicker');
      if (starPicker && !starPicker.dataset.bound) {
        starPicker.dataset.bound = 'true';
        starPicker.querySelectorAll('.star-pick').forEach(star => {
          star.addEventListener('click', () => {
            selectedStarRating = parseInt(star.dataset.value, 10);
            renderStarPicker();
          });
        });
      }

      if (!userStr) {
        writeCard.style.display = 'none';
        loginPrompt.style.display = 'block';
        if (notEligible) notEligible.style.display = 'none';
        return;
      }

      loginPrompt.style.display = 'none';

      let canReview = true;
      let reasonMsg = '';
      try {
        const user = JSON.parse(userStr);
        const res = await fetch(`/api/tours/${tourId}/can-review?user_id=${user.id}`);
        const data = await res.json();
        canReview = data.canReview;
        reasonMsg = data.message || '';
      } catch (e) {
        console.error('❌ Không kiểm tra được quyền đánh giá:', e);
      }

      if (canReview) {
        writeCard.style.display = 'block';
        if (notEligible) notEligible.style.display = 'none';
      } else {
        writeCard.style.display = 'none';
        if (notEligible) {
          notEligible.style.display = 'block';
          notEligible.innerHTML = `⚠️ ${reasonMsg} Bạn cần <a href="tai_khoan.html">đặt và hoàn thành chuyến đi</a> để đánh giá tour này.`;
        }
      }
    }

    function renderStarPicker() {
      document.querySelectorAll('#starPicker .star-pick').forEach(star => {
        const value = parseInt(star.dataset.value, 10);
        if (value <= selectedStarRating) {
          star.textContent = '★';
          star.classList.add('selected');
        } else {
          star.textContent = '☆';
          star.classList.remove('selected');
        }
      });
    }

    async function loadReviews(tourId) {
      const listEl = document.getElementById('reviewList');
      setupReviewForm(tourId);

      try {
        const res = await fetch(`/api/tours/${tourId}/reviews`);
        const reviews = await res.json();

        const count = reviews.length;
        const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
        const starsFull = Math.round(avg);

        document.getElementById('reviewAvgScore').textContent = count > 0 ? avg.toFixed(1) : '0.0';
        document.getElementById('reviewAvgStars').textContent = '★'.repeat(starsFull) + '☆'.repeat(5 - starsFull);
        document.getElementById('reviewCountText').textContent =
          count > 0 ? `Dựa trên ${count} đánh giá` : 'Chưa có đánh giá nào';

        const userStr = localStorage.getItem('user');
        const btn = document.querySelector('.btn-submit-review');
        const commentInput = document.getElementById('reviewCommentInput');
        if (userStr && btn && commentInput) {
          const currentUser = JSON.parse(userStr);
          const myReview = reviews.find(r => r.user_id === currentUser.id);
          if (myReview) {
            selectedStarRating = myReview.rating;
            renderStarPicker();
            commentInput.value = myReview.comment;
            btn.textContent = 'Cập nhật đánh giá';
          } else {
            btn.textContent = 'Gửi đánh giá';
          }
        }

        if (count === 0) {
          listEl.innerHTML = '<div class="no-reviews-yet">Chưa có đánh giá nào cho tour này. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</div>';
          return;
        }

        listEl.innerHTML = reviews.map(r => {
          const dateStr = new Date(r.created_at).toLocaleDateString('vi-VN');
          return `
            <div class="review-item">
              <div class="review-item-header">
                <span class="review-item-name">${escapeHtml(r.user_name)}</span>
                <span class="review-item-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
              </div>
              <div class="review-item-date">${dateStr}</div>
              <div class="review-item-comment">${escapeHtml(r.comment)}</div>
            </div>
          `;
        }).join('');

      } catch (err) {
        console.error('❌ Error loading reviews:', err);
        listEl.innerHTML = '<p class="loading-text">Không thể tải đánh giá. Vui lòng kiểm tra backend đang chạy.</p>';
      }
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str || '';
      return div.innerHTML;
    }

    async function submitReview() {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        window.location.href = 'auth.html';
        return;
      }
      const user = JSON.parse(userStr);
      const comment = document.getElementById('reviewCommentInput').value.trim();
      const msgEl = document.getElementById('reviewFormMessage');
      const btn = document.querySelector('.btn-submit-review');

      if (selectedStarRating === 0) {
        msgEl.textContent = '❌ Vui lòng chọn số sao đánh giá';
        msgEl.className = 'review-form-message show error';
        return;
      }
      if (!comment) {
        msgEl.textContent = '❌ Vui lòng viết bình luận';
        msgEl.className = 'review-form-message show error';
        return;
      }
      if (!activeTour) return;

      btn.disabled = true;
      btn.textContent = 'Đang gửi...';

      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_id: activeTour.id,
            user_id: user.id,
            rating: selectedStarRating,
            comment
          })
        });
        const data = await res.json();

        if (data.success) {
          msgEl.textContent = '✅ ' + data.message;
          msgEl.className = 'review-form-message show success';
          document.getElementById('reviewCommentInput').value = '';
          selectedStarRating = 0;
          renderStarPicker();
          loadReviews(activeTour.id);
        } else {
          msgEl.textContent = '❌ ' + (data.error || 'Có lỗi xảy ra');
          msgEl.className = 'review-form-message show error';
        }
      } catch (err) {
        console.error('❌ Error submitting review:', err);
        msgEl.textContent = '❌ Không kết nối được server';
        msgEl.className = 'review-form-message show error';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Gửi đánh giá';
      }
    }

function toggleBooking() {
  const wrapper = document.getElementById('bookingContentWrapper');
  const icon = document.getElementById('bookingToggleIcon');
  if (wrapper.style.maxHeight === '0px') {
    wrapper.style.maxHeight = '1000px';
    wrapper.style.opacity = '1';
    icon.style.transform = 'rotate(0deg)';
  } else {
    wrapper.style.maxHeight = '0px';
    wrapper.style.opacity = '0';
    icon.style.transform = 'rotate(180deg)';
  }
}
