// ==========================================
// 1. منوی همبرگر
// ==========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('show');
    });
    // بستن منو با کلیک روی لینک‌ها
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('show');
        });
    });
}

// ==========================================
// 2. دکمه بازگشت به بالا
// ==========================================
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
});
if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 3. شمارنده آمار (Intersection Observer)
// ==========================================
const statNumbers = document.querySelectorAll('.stat-number');
let counted = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
            counted = true;
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                if (isNaN(target)) return;
                let current = 0;
                const step = Math.ceil(target / 50);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        el.textContent = current.toLocaleString();
                    }
                }, 25);
            });
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// ==========================================
// 4. گالری و لایتباکس
// ==========================================
const galleryItems = [
    { src: 'https://via.placeholder.com/600x400/4caf50/fff?text=جنگل+چایباغ', category: 'nature', caption: 'منظره جنگلی' },
    { src: 'https://via.placeholder.com/600x400/8bc34a/fff?text=باغ+چای', category: 'farming', caption: 'باغات چای' },
    { src: 'https://via.placeholder.com/600x400/ff9800/fff?text=روستا', category: 'place', caption: 'بافت روستایی' },
    { src: 'https://via.placeholder.com/600x400/2196f3/fff?text=آبشار', category: 'nature', caption: 'آبشار زیبا' },
    { src: 'https://via.placeholder.com/600x400/9c27b0/fff?text=مراسم+محلی', category: 'place', caption: 'مراسم محلی' },
    { src: 'https://via.placeholder.com/600x400/f44336/fff?text=دامداری', category: 'farming', caption: 'دامداری سنتی' },
];

const galleryGrid = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
let currentFilter = 'all';
let currentView = 'compact';
let currentIndex = 0;

function renderGallery(filter = 'all', view = 'compact') {
    if (!galleryGrid) return;
    const filtered = filter === 'all' ? galleryItems : galleryItems.filter(item => item.category === filter);
    galleryGrid.className = `gallery-grid ${view}`;
    galleryGrid.innerHTML = filtered.map((item, index) => `
        <div class="gallery-item" data-index="${index}" data-category="${item.category}">
            <img src="${item.src}" alt="${item.caption || 'تصویر گالری'}" loading="lazy" />
            <div class="caption">${item.caption || ''}</div>
        </div>
    `).join('');

    // رویداد کلیک برای لایتباکس
    document.querySelectorAll('.gallery-item').forEach(el => {
        el.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            // پیدا کردن ایندکس واقعی در آرایه اصلی (با احتساب فیلتر)
            const realItems = filter === 'all' ? galleryItems : galleryItems.filter(i => i.category === filter);
            const realIndex = galleryItems.indexOf(realItems[idx]);
            if (realIndex !== -1) openLightbox(realIndex);
        });
    });
}

// فیلتر
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderGallery(currentFilter, currentView);
    });
});

// تغییر نمای گالری
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentView = this.dataset.view;
        renderGallery(currentFilter, currentView);
    });
});

// لایتباکس
function openLightbox(index) {
    currentIndex = index;
    const item = galleryItems[index];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < galleryItems.length) {
        openLightbox(newIndex);
    }
}

// رویدادهای لایتباکس
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});
lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// اجرای اولیه گالری
renderGallery('all', 'compact');

// ==========================================
// 5. فرم رزرو (ذخیره در localStorage)
// ==========================================
const reserveForm = document.getElementById('reserveForm');
const formMessage = document.getElementById('formMessage');

reserveForm?.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guests = parseInt(document.getElementById('guests').value) || 1;

    // اعتبارسنجی
    if (!name || name.length < 3) {
        showMessage('لطفاً نام کامل را وارد کنید (حداقل ۳ کاراکتر)', 'error');
        return;
    }
    if (!phone || !/^09\d{9}$/.test(phone)) {
        showMessage('شماره تماس معتبر وارد کنید (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)', 'error');
        return;
    }
    if (!checkIn || !checkOut) {
        showMessage('تاریخ ورود و خروج را انتخاب کنید', 'error');
        return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
        showMessage('تاریخ خروج باید بعد از تاریخ ورود باشد', 'error');
        return;
    }

    // ذخیره
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const newRes = {
        id: Date.now(),
        name,
        phone,
        checkIn,
        checkOut,
        guests,
        createdAt: new Date().toISOString()
    };
    reservations.push(newRes);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    showMessage('✅ رزرو شما با موفقیت ثبت شد!', 'success');
    this.reset();
});

function showMessage(text, type) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

// ==========================================
// 6. پنل مدیریت (ادمین)
// ==========================================
function loadAdminPanel() {
    const tbody = document.getElementById('reservationBody');
    const totalSpan = document.getElementById('totalReservations');
    const todaySpan = document.getElementById('todayReservations');
    if (!tbody) return;

    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
    // رفع مشکل داده‌های قدیمی (اضافه کردن createdAt)
    reservations = reservations.map(r => {
        if (!r.createdAt) {
            r.createdAt = new Date().toISOString();
        }
        if (!r.id) r.id = Date.now() + Math.random();
        return r;
    });
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // آمار
    const today = new Date().toISOString().split('T')[0];
    const todayCount = reservations.filter(r => r.createdAt.startsWith(today)).length;
    if (totalSpan) totalSpan.textContent = reservations.length;
    if (todaySpan) todaySpan.textContent = todayCount;

    // نمایش جدول
    if (reservations.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state">هیچ رزروی ثبت نشده است.</td></tr>`;
        return;
    }

    tbody.innerHTML = reservations.map((r, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${r.name}</td>
            <td>${r.phone}</td>
            <td>${toPersianDate(r.checkIn)}</td>
            <td>${toPersianDate(r.checkOut)}</td>
            <td>${r.guests}</td>
            <td>${toPersianDate(r.createdAt)}</td>
            <td class="no-print">
                <button class="btn-delete" onclick="deleteReservation(${r.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// تبدیل تاریخ میلادی به شمسی (ساده)
function toPersianDate(dateStr) {
    if (!dateStr) return 'نامشخص';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fa-IR', options);
}

// حذف تکی
function deleteReservation(id) {
    if (!confirm('آیا از حذف این رزرو مطمئن هستید؟')) return;
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations = reservations.filter(r => r.id !== id);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    loadAdminPanel();
}

// حذف همه
function deleteAllReservations() {
    if (!confirm('⚠️ تمام رزروها حذف خواهند شد! مطمئن هستید؟')) return;
    localStorage.removeItem('reservations');
    loadAdminPanel();
}

// بارگذاری ادمین در صورت وجود تابع
if (document.getElementById('reservationBody')) {
    loadAdminPanel();
                                                        }
