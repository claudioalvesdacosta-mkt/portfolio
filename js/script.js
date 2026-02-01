// --- Smooth Scrolling for Navigation ---
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        // Apenas previne o comportamento padrão se for um link interno (começa com #)
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// --- Scrollspy for Active Navigation Link ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

function activateNavLink() {
    if (sections.length === 0) return;

    let index = sections.length;

    while(--index && window.scrollY + 100 < (sections[index]?.offsetTop || 0)) {}
    
    navLinks.forEach((link) => link.classList.remove('nav-active'));
    
    // Check if the corresponding link exists before adding the class
    if (index >= 0 && navLinks[index]) {
       navLinks[index].classList.add('nav-active');
    }
}

// Listen for scroll events
window.addEventListener('scroll', activateNavLink);
// Activate on load
activateNavLink();


// --- Contact Form Validation ---
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        formMessage.style.display = 'none';
        formMessage.classList.remove('success', 'error');

        const name = contactForm.elements['name'].value.trim();
        const email = contactForm.elements['email'].value.trim();
        const message = contactForm.elements['message'].value.trim();

        if (!name || !email || !message) {
            displayMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            displayMessage('Por favor, insira um endereço de e-mail válido.', 'error');
            return;
        }

        // --- Form Submission Simulation ---
        // This is a placeholder. In a real application, you would send this to a backend.
        displayMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
        contactForm.reset(); // Clear form fields on success
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function displayMessage(message, type) {
    formMessage.textContent = message;
    formMessage.classList.add(type);
    formMessage.style.display = 'block';
}

// --- Project Slider ---
const sliderTrack = document.querySelector('.slider-track');
if (sliderTrack) {
    const slides = document.querySelectorAll('.slider-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    
    // Determine items per view based on window width (matches CSS media query)
    function getItemsPerView() {
        return window.innerWidth >= 768 ? 3 : 1;
    }

    function updateSlider() {
        const itemsPerView = getItemsPerView();
        const slideWidth = 100 / itemsPerView;
        sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }

    function moveSlide(direction) {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, slides.length - itemsPerView);

        if (direction === 'next') {
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
        } else {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex; // Loop to end
            }
        }
        updateSlider();
    }

    nextBtn.addEventListener('click', () => moveSlide('next'));
    prevBtn.addEventListener('click', () => moveSlide('prev'));

    window.addEventListener('resize', () => {
        currentIndex = 0; // Reset on resize to avoid alignment issues
        updateSlider();
    });
}