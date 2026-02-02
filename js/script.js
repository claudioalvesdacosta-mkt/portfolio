document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const isOpen = nav.classList.contains('active');
            mobileBtn.innerHTML = isOpen 
                ? '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                : '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileBtn.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            });
        });
    }

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
