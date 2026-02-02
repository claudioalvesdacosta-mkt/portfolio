document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Slider na Home ---
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (track) {
        let index = 0;

        const updateSlider = () => {
            const itemsVisible = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            const itemWidth = track.querySelector('.slider-item').offsetWidth + 32; // width + gap
            track.style.transform = `translateX(-${index * itemWidth}px)`;
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const items = track.querySelectorAll('.slider-item');
                const itemsVisible = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
                if (index < items.length - itemsVisible) {
                    index++;
                    updateSlider();
                } else {
                    index = 0; // Volta ao início
                    updateSlider();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const items = track.querySelectorAll('.slider-item');
                if (index > 0) {
                    index--;
                    updateSlider();
                } else {
                    const itemsVisible = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
                    index = items.length - itemsVisible; // Vai para o fim
                    updateSlider();
                }
            });
        }

        // Suporte para Arrastar (Drag)
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.transition = 'none';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = index;
        });

        track.addEventListener('mouseleave', () => { isDown = false; track.style.transition = ''; });
        track.addEventListener('mouseup', () => { isDown = false; track.style.transition = ''; });

        window.addEventListener('resize', updateSlider);
    }

    // --- Lógica do Lightbox (Zoom e Foco Total) ---
    // Removemos .work-thumb img para permitir a navegação nos cards de trabalhos
    const galleryItems = document.querySelectorAll('.gallery-item img, .project-full-image img');
    
    if (galleryItems.length > 0) {
        let lightbox = document.querySelector('.lightbox-overlay');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'lightbox-overlay';
            lightbox.innerHTML = `
                <div class="lightbox-close">&times;</div>
                <img class="lightbox-img" src="" alt="Zoom">
            `;
            document.body.appendChild(lightbox);
        }

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        galleryItems.forEach(img => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) closeLightbox();
        });

        lightboxClose.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // --- Premium Scroll Reveal ---
    const revealElements = document.querySelectorAll('section h2, section p, .work-card, .service-card, .slider-container');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    });

    revealElements.forEach(el => {
        el.classList.add('reveal-up');
        revealObserver.observe(el);
    });
});
