// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.padding = '12px 0';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.padding = '20px 0';
    }
});

// Animate Elements on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections except hero
document.querySelectorAll('section').forEach(section => {
    // Skip hero section to prevent scroll issues
    if (!section.classList.contains('hero-section')) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    }
});

// Service Card Hover Effect Enhancement
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Benefit Card Animation
document.querySelectorAll('.benefit-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});


// Add Active State to Navigation on Scroll
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Button Click Animation
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        let ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add Ripple Effect CSS Dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Counter Animation for Stats (if you add stats section later)
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Mobile Menu Close on Link Click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});


console.log('CoolAir Pro Website Loaded Successfully! 🎉');

/* ===================================
   IMMERSIVE GALLERY LOGIC
   =================================== */
const track = document.getElementById('galleryTrack');
const viewport = document.querySelector('.gallery-viewport');
const progress = document.getElementById('galleryProgress');
const items = document.querySelectorAll('.gallery-item-wrapper');

let isDragging = false;
let startX = 0;
let scrollLeft = 0;
let velocity = 0;
let lastX = 0;
let animationId = null;

// Intersection Observer for Entrance Animation
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Stagger items
            const itemCards = entry.target.querySelectorAll('.gallery-item-wrapper');
            itemCards.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, { threshold: 0.2 });

const gallerySection = document.querySelector('.immersive-gallery-section');
if (gallerySection) galleryObserver.observe(gallerySection);

// Drag Functions
const startDrag = (e) => {
    if (window.innerWidth < 992) return; // Disable on mobile vertical layout
    isDragging = true;
    viewport.style.cursor = 'grabbing';
    startX = (e.pageX || e.touches[0].pageX) - track.offsetLeft;
    scrollLeft = track.style.transform ? parseInt(track.style.transform.replace('translateX(', '').replace('px)', '')) : 0;
    cancelAnimationFrame(animationId);
};

const endDrag = () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
    requestAnimationFrame(applyInertia);
};

const moveDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = (e.pageX || e.touches[0].pageX) - track.offsetLeft;
    const walk = (x - startX) * 1.5;

    velocity = x - lastX;
    lastX = x;

    updateTrackPosition(scrollLeft + walk);
};

const updateTrackPosition = (pos) => {
    // Limits
    const minScroll = -(track.scrollWidth - viewport.clientWidth + 200);
    const maxScroll = 0;

    const finalPos = Math.max(minScroll, Math.min(maxScroll, pos));
    track.style.transform = `translateX(${finalPos}px)`;

    // Update Progress
    const progressPercent = (finalPos / minScroll) * 100;
    if (progress) progress.style.width = `${progressPercent}%`;
};

const applyInertia = () => {
    if (Math.abs(velocity) > 0.5) {
        const currentPos = track.style.transform ? parseInt(track.style.transform.replace('translateX(', '').replace('px)', '')) : 0;
        updateTrackPosition(currentPos + velocity);
        velocity *= 0.95; // Friction
        animationId = requestAnimationFrame(applyInertia);
    }
};

if (viewport) {
    viewport.addEventListener('mousedown', startDrag);
    viewport.addEventListener('touchstart', startDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', moveDrag);

    viewport.style.cursor = 'grab';

    // Navigation Button Logic
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const currentPos = track.style.transform ? parseInt(track.style.transform.replace('translateX(', '').replace('px)', '')) : 0;
            updateTrackPosition(currentPos + 460); // Card width (400) + gap (60)
        });

        nextBtn.addEventListener('click', () => {
            const currentPos = track.style.transform ? parseInt(track.style.transform.replace('translateX(', '').replace('px)', '')) : 0;
            updateTrackPosition(currentPos - 460);
        });
    }
}

// Cinematic Modal Logic
const modal = document.getElementById('cinematicModal');
const modalImg = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCat = document.getElementById('modalCategory');
let currentGalleryIndex = 0;

window.openCinematic = function (element) {
    const img = element.querySelector('img');
    const title = element.querySelector('h3').innerText;
    const category = element.querySelector('span').innerText;

    modalImg.src = img.src;
    modalTitle.innerText = title;
    modalCat.innerText = category;

    const allItems = Array.from(document.querySelectorAll('.gallery-item'));
    currentGalleryIndex = allItems.indexOf(element);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeCinematic = function () {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

window.changeCinematic = function (dir) {
    const allItems = Array.from(document.querySelectorAll('.gallery-item'));
    currentGalleryIndex = (currentGalleryIndex + dir + allItems.length) % allItems.length;

    const targetItem = allItems[currentGalleryIndex];
    const img = targetItem.querySelector('img');
    const title = targetItem.querySelector('h3').innerText;
    const category = targetItem.querySelector('span').innerText;

    modalImg.style.opacity = '0';
    setTimeout(() => {
        modalImg.src = img.src;
        modalTitle.innerText = title;
        modalCat.innerText = category;
        modalImg.style.opacity = '1';
    }, 300);
};

// Keyboard Navigation for Modal
window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeCinematic();
    if (e.key === 'ArrowRight') changeCinematic(1);
    if (e.key === 'ArrowLeft') changeCinematic(-1);
});

// Cursor Position Tilt Effect on Items
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        item.style.transform = `
            translateY(-20px) 
            scale(1.05) 
            rotateY(${x * 10}deg) 
            rotateX(${y * -10}deg)
        `;
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = `translateY(0) scale(1) rotateY(0) rotateX(0)`;
    });
});

/* ===================================
   PREMIUM CALENDAR LOGIC
   =================================== */
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let calendarSelectedDate = null; // Renamed to avoid conflicts

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

function renderCalendar() {
    const daysContainer = document.getElementById('calendarDays');
    if (!daysContainer) return;

    daysContainer.innerHTML = '';

    // Update Header
    const headerTitle = document.getElementById('currentMonthYear');
    if (headerTitle) headerTitle.innerText = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const today = new Date();

    // Prev Month Days
    for (let i = firstDay; i > 0; i--) {
        const dayDiv = createDayElement(prevMonthDays - i + 1, 'other-month', null);
        daysContainer.appendChild(dayDiv);
    }

    // Current Month Days
    for (let i = 1; i <= daysInMonth; i++) {
        let className = 'stagger-in';
        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            className += ' today';
        }

        // Mock event logic removed as per user request

        // Check if selected
        if (calendarSelectedDate && i === calendarSelectedDate.getDate() && currentMonth === calendarSelectedDate.getMonth() && currentYear === calendarSelectedDate.getFullYear()) {
            className += ' selected';
        }

        const dayDiv = createDayElement(i, className, i);
        dayDiv.style.animationDelay = `${i * 0.01}s`;

        dayDiv.onclick = () => selectCalendarDate(i);
        daysContainer.appendChild(dayDiv);
    }

    renderAgenda();
}

function createDayElement(num, classes, dayVal) {
    const div = document.createElement('div');
    div.className = `calendar-day ${classes}`;
    if (dayVal) div.setAttribute('data-day', dayVal);
    div.innerHTML = `<span class="day-number">${num}</span>`;

    return div;
}

function selectCalendarDate(day) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));

    // Add new selection
    const target = document.querySelector(`.calendar-day[data-day="${day}"]`);
    if (target) target.classList.add('selected');

    calendarSelectedDate = new Date(currentYear, currentMonth, day);

    // Update Hidden Input for form
    const bookingInput = document.getElementById('bookingDate');
    if (bookingInput) bookingInput.value = calendarSelectedDate.toISOString().split('T')[0];
}

function changeMonth(dir) {
    currentMonth += dir;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function switchCalendarView(view, btnElement) {
    const monthView = document.getElementById('monthView');
    const agendaView = document.getElementById('agendaView');
    const btns = document.querySelectorAll('.view-btn');

    btns.forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    if (view === 'month') {
        if (monthView) monthView.style.display = 'block';
        if (agendaView) agendaView.classList.remove('active');
    } else if (view === 'agenda') {
        if (monthView) monthView.style.display = 'none';
        if (agendaView) agendaView.classList.add('active');
    }
}

// Logic for drawer removed based on user request

function renderAgenda() {
    const agenda = document.getElementById('agendaView');
    if (!agenda) return;

    const events = [
        { day: 2, name: 'Tue', title: 'Maintenance Window', time: '10:00 AM - 12:00 PM' },
        { day: 5, name: 'Fri', title: 'Installation Slot', time: '02:00 PM - 04:00 PM' },
        { day: 12, name: 'Mon', title: 'AMC Support', time: '09:00 AM - 11:00 AM' }
    ];

    agenda.innerHTML = '';
    events.forEach(e => {
        const item = document.createElement('div');
        item.className = 'agenda-item';
        item.innerHTML = `
            <div class="agenda-date">
                <div class="agenda-day-name">${e.name}</div>
                <div class="agenda-day-num">${e.day}</div>
            </div>
            <div class="agenda-content">
                <h5>${e.title}</h5>
                <p><i class="far fa-clock me-1"></i> ${e.time}</p>
            </div>
        `;
        item.onclick = () => selectCalendarDate(e.day);
        agenda.appendChild(item);
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderCalendar();
        initHeroSlideshow();
    });
} else {
    renderCalendar();
    initHeroSlideshow();
}

/* ===================================
   HERO SLIDESHOW LOGIC
   =================================== */
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 3000; // 3 seconds per user request

    // Ensure first slide is active
    slides.forEach((slide, index) => {
        if (index === 0) slide.classList.add('active');
        else slide.classList.remove('active');
    });

    setInterval(() => {
        // Remove active from current
        slides[currentSlide].classList.remove('active');

        // Move to next
        currentSlide = (currentSlide + 1) % slides.length;

        // Add active to next
        slides[currentSlide].classList.add('active');
    }, slideInterval);
}

