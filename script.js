// ===== 1. منوی همبرگر =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
    hamburger.classList.toggle('active');
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        hamburger.classList.remove('active');
    });
});

// ===== 2. هدر اسکرول =====
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== 3. شمارشگر آمار =====
const statNumbers = document.querySelectorAll('.stat-number');
const animateStats = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            let current = 0;
            const step = Math.ceil(target / 50);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = current;
                }
            }, 30);
            observer.unobserve(el);
        }
    });
};
const observer = new IntersectionObserver(animateStats, { threshold: 0.5 });
statNumbers.forEach(num => observer.observe(num));

// ===== 4. گالری =====
const galleryItems = [
    // طبیعت
    { src: 'https://s21.uupload.ir/files/chaybagh/47413529-7788-l__4667.jpg', category: 'nature' },
    { src: 'https://s21.uupload.ir/files/chaybagh/47485241-3397-l__1644.jpg', category: 'nature' },
    { src: 'https://s21.uupload.ir/files/chaybagh/47413529-7788-l__4667.jpg', category: 'nature' },
    // کشاورزی
    { src: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&h=450&fit=crop&crop=center', category: 'agriculture' },
    { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=450&fit=crop&crop=center', category: 'agriculture' },
    { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=450&fit=crop&crop=center', category: 'agriculture' },
    // اماکن
    { src: 'https://s25.uupload.ir/files/chaybagh/images.jpeg', category: 'places' },
    { src: 'https://s21.uupload.ir/files/chaybagh/IMG_20260724_222449.jpg', category: 'places' },
    { src: 'https://s25.uupload.ir/files/chaybagh/IMG_20260724_222432.jpg', category: 'places' },
    { src: 'https://s25.uupload.ir/files/chaybagh/IMG_20260724_222353.jpg', category: 'places' },
];

const galleryGrid = document.getElementById('galleryGrid');
const galleryFilter = document.getElementById('galleryFilter');
const toggleBtn = document.getElementById('galleryToggleBtn');
let isFullMode = false;
let currentCategory = 'all';

function getCategoryLabel(cat) {
    const map = { 'nature': 'طبیعت', 'agriculture': 'کشاورزی', 'places': 'اماکن' };
    return map[cat] || cat;
}

function renderGallery(category) {
    const filtered = category === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.category === category);
    
    galleryGrid.innerHTML = '';
    filtered.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="${item.src}" alt="" loading="lazy" />
            <div class="overlay">
                <span class="category-badge">${getCategoryLabel(item.category)}</span>
            </div>
        `;
        div.addEventListener('click', () => {
            const realIndex = galleryItems.indexOf(item);
            openLightbox(realIndex);
        });
        galleryGrid.appendChild(div);
    });

    if (isFullMode) {
        galleryGrid.classList.remove('compact');
        galleryGrid.classList.add('full');
    } else {
        galleryGrid.classList.remove('full');
        galleryGrid.classList.add('compact');
    }
}

renderGallery('all');

// دکمه تغییر حالت
toggleBtn.addEventListener('click', () => {
    isFullMode = !isFullMode;
    
    if (isFullMode) {
        galleryGrid.classList.remove('compact');
        galleryGrid.classList.add('full');
        galleryFilter.style.display = 'flex';
        toggleBtn.innerHTML = '<i class="fas fa-compress-alt"></i> بستن گالری';
        toggleBtn.classList.add('btn-outline');
        toggleBtn.classList.remove('btn-primary');
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    } else {
        galleryGrid.classList.remove('full');
        galleryGrid.classList.add('compact');
        galleryFilter.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-images"></i> مشاهده همه تصاویر';
        toggleBtn.classList.remove('btn-outline');
        toggleBtn.classList.add('btn-primary');
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
        currentCategory = 'all';
        renderGallery('all');
    }
});

// فیلترها
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isFullMode) return;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.filter;
        renderGallery(currentCategory);
    });
});

// ===== 5. لایت‌باکس =====
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightbox() {
    const img = galleryItems[currentIndex];
    lbImg.src = img.src;
    lbImg.alt = '';
    if (img.caption) {
        lbCaption.textContent = img.caption;
        lbCaption.style.display = 'block';
    } else {
        lbCaption.textContent = '';
        lbCaption.style.display = 'none';
    }
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
});
document.getElementById('lbNext').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightbox();
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightbox();
    }
    if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightbox();
    }
});

// ===== 6. کارت‌های رزرو =====
const bookings = [
    { name: 'کلبه چای‌کار', price: 850000, img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&crop=center', features: ['چای‌زار', 'آبگرم'] },
    { name: 'خانه بوم‌گردی مهر', price: 620000, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&crop=center', features: ['سنتی', 'حیاط'] },
    { name: 'ویلای جنگلی', price: 1200000, img: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&h=400&fit=crop&crop=center', features: ['جنگل', 'استخر'] },
];

const bookingGrid = document.getElementById('bookingGrid');
bookings.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'booking-card';
    div.innerHTML = `
        <img src="${item.img}" alt="${item.name}" loading="lazy" />
        <div class="body">
            <h3>${item.name}</h3>
            <div class="features">
                <span><i class="fas fa-user"></i> ${item.features.length} نفر</span>
                ${item.features.map(f => `<span><i class="fas fa-check"></i> ${f}</span>`).join('')}
            </div>
            <div><span class="price">${item.price.toLocaleString()}</span> <span class="unit">تومان / شب</span></div>
            <button class="btn btn-primary" style="margin-top:10px;" onclick="openModal()">رزرو</button>
        </div>
    `;
    bookingGrid.appendChild(div);
});

// ===== 7. مودال رزرو =====
const modal = document.getElementById('bookingModal');
const modalClose = document.getElementById('modalClose');

window.openModal = function() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('bookName').value.trim(),
        phone: document.getElementById('bookPhone').value.trim(),
        checkin: document.getElementById('bookCheckin').value,
        checkout: document.getElementById('bookCheckout').value,
        guests: document.getElementById('bookGuests').value,
    };
    if (!data.name || !data.phone || !data.checkin || !data.checkout) {
        alert('لطفاً تمام فیلدها را پر کنید.');
        return;
    }
    let list = JSON.parse(localStorage.getItem('reservations')) || [];
    list.push(data);
    localStorage.setItem('reservations', JSON.stringify(list));
    alert('رزرو شما با موفقیت ثبت شد.');
    document.getElementById('bookingForm').reset();
    closeModal();
});

// ===== 8. فرم تماس =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim(),
    };
    if (!data.name || !data.email || !data.message) {
        alert('لطفاً نام، ایمیل و پیام را پر کنید.');
        return;
    }
    let list = JSON.parse(localStorage.getItem('messages')) || [];
    list.push(data);
    localStorage.setItem('messages', JSON.stringify(list));
    alert('پیام شما با موفقیت ارسال شد.');
    document.getElementById('contactForm').reset();
});

// ===== 9. دکمه برگشت به بالا =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

console.log('✅ پروژه کامل چای‌باغ با موفقیت بارگذاری شد!');
