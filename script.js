// ========== VARIABLES GLOBALES ==========
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const scrollToTopBtn = document.getElementById('scrollToTop');
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

// ========== MENÚ HAMBURGUESA ==========
function toggleMenu() {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    if (mainNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Event listener para el botón hamburguesa
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        mainNav.classList.contains('active') && 
        !mainNav.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        toggleMenu();
    }
});

// ========== SMOOTH SCROLL ==========
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerOffset = 20;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Aplicar smooth scroll a todos los enlaces internos
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            smoothScroll(href);
        }
    });
});

// ========== SCROLL TO TOP ==========
function handleScrollToTop() {
    // Mostrar/ocultar botón según scroll
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

// Event listener para scroll
window.addEventListener('scroll', handleScrollToTop);

// Click en botón scroll to top
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== INTERSECTION OBSERVER - ANIMACIONES ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Aplicar observer a todas las secciones
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease-out';
    observer.observe(section);
});

// ========== ANIMACIÓN DE SKILLS ==========
const skillCards = document.querySelectorAll('.skill-card');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillLevel = entry.target.querySelector('.skill-level');
            if (skillLevel) {
                skillLevel.style.animation = 'fillSkill 2s ease-out forwards';
            }
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillCards.forEach(card => {
    skillObserver.observe(card);
});

// ========== NAVEGACIÓN ACTIVA ==========
function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ========== EFECTO PARALLAX SUAVE ==========
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const horizon = document.querySelector('.horizon');
    
    if (horizon) {
        horizon.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(parallaxEffect);
});

// ========== EFECTO DE ESCRITURA EN HEADER ==========
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========== MANEJO DE RESIZE ==========
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Restablecer el menú en desktop
        if (window.innerWidth > 768) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }, 250);
});

// ========== PREVENIR ZOOM EN DOBLE TAP (MÓVIL) ==========
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ========== LAZY LOADING DE IMÁGENES ==========
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========== DETECCIÓN DE TOUCH DEVICE ==========
function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// ========== PERFORMANCE OPTIMIZATION ==========
// Debounce function para eventos que se disparan frecuentemente
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce al scroll
const debouncedScroll = debounce(() => {
    updateActiveNav();
    handleScrollToTop();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ========== ANIMACIÓN DE ENTRADA AL CARGAR ==========
window.addEventListener('load', () => {
    // Animar header
    const header = document.querySelector('header');
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'scale(0.9)';
        setTimeout(() => {
            header.style.transition = 'all 0.8s ease-out';
            header.style.opacity = '1';
            header.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Lazy load de imágenes
    lazyLoadImages();
});

// ========== EASTER EGG - SECUENCIA DE TECLAS ==========
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateMatrixMode();
    }
});

function activateMatrixMode() {
    // Cambiar colores a verde matrix
    document.documentElement.style.setProperty('--color-primary', '#00ff00');
    document.documentElement.style.setProperty('--color-secondary', '#00ff00');
    document.documentElement.style.setProperty('--color-accent', '#00ff00');
    
    // Crear efecto de lluvia de caracteres
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9998';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    const matrixInterval = setInterval(drawMatrix, 33);
    
    // Desactivar después de 10 segundos
    setTimeout(() => {
        clearInterval(matrixInterval);
        canvas.remove();
        location.reload();
    }, 10000);
    
    console.log('🎮 Matrix Mode Activated! Reloading in 10 seconds...');
}

// ========== MODO OSCURO / CLARO (OPCIONAL) ==========
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// ========== CONSOLA DE DESARROLLADOR ==========
console.log('%c🎮 DEV_MATRIX PORTFOLIO 🎮', 'color: #00ff41; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #00ffff; font-size: 12px;');
console.log('%cBuilt with love in the Cyberpunk Universe', 'color: #ff00ff; font-size: 12px;');

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Portfolio initialized successfully');
    
    // Verificar que todos los elementos existen
    if (!menuToggle) console.warn('⚠️ Menu toggle button not found');
    if (!mainNav) console.warn('⚠️ Main nav not found');
    if (!scrollToTopBtn) console.warn('⚠️ Scroll to top button not found');
    
    // Mensaje de bienvenida
    setTimeout(() => {
        console.log('%c>>> System Online', 'color: #00ff41; font-weight: bold;');
        console.log('%c>>> All Functions Operational', 'color: #00ff41;');
    }, 1000);
});

// ========== EXPORT FUNCTIONS (si se usa módulos) ==========
// export { toggleMenu, smoothScroll, toggleTheme };
