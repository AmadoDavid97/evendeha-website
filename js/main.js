 // Mobile menu toggle
        function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('active');
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    document.querySelector('.nav-links').classList.remove('active');
                }
            });
        });

        // Header shadow on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });

        // Form submission handler
        function handleSubmit(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData);
            
            // Crear mensaje para WhatsApp
            const message = `¡Hola! Me interesa eVendeha.%0A%0A` +
                          `Nombre: ${data.name}%0A` +
                          `Email: ${data.email}%0A` +
                          `Teléfono: ${data.phone}%0A` +
                          `Tipo de Negocio: ${data.business}%0A` +
                          `Mensaje: ${data.message}`;
            
            // Redirigir a WhatsApp
            window.open(`https://wa.me/595985805967?text=${message}`, '_blank');
            
            // Limpiar formulario
            event.target.reset();
            alert('¡Gracias por tu interés! Te redirigiremos a WhatsApp para continuar la conversación.');
        }

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });

        // Observe module cards
        document.querySelectorAll('.module-card, .sector-card, .team-member').forEach(card => {
            observer.observe(card);
        });

        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicatorsContainer = document.getElementById('indicators');
        const cards = track.querySelectorAll('.client-card');
        
        let currentIndex = 0;
        let cardsToShow = getCardsToShow();
        const totalCards = cards.length;
        const maxIndex = Math.max(0, totalCards - cardsToShow);

        function getCardsToShow() {
            const width = window.innerWidth;
            if (width < 480) return 1;
            if (width < 768) return 2;
            if (width < 1024) return 3;
            return 4;
        }

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24; // 1.5rem
            const offset = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
            
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            
            updateIndicators();
        }

        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            const totalPages = maxIndex + 1;
            
            for (let i = 0; i <= maxIndex; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                indicator.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                indicatorsContainer.appendChild(indicator);
            }
        }

        function updateIndicators() {
            const indicators = indicatorsContainer.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        // Soporte para deslizamiento táctil
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50 && currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
            if (touchEndX > touchStartX + 50 && currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
            if (e.key === 'ArrowRight' && currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        // Auto-play opcional (comentado por defecto)
        let autoPlayInterval = setInterval(() => {
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }, 3000);

        track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        track.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            }, 3000);
        });

        // Responsive
        window.addEventListener('resize', () => {
            cardsToShow = getCardsToShow();
            const newMaxIndex = Math.max(0, totalCards - cardsToShow);
            if (currentIndex > newMaxIndex) {
                currentIndex = newMaxIndex;
            }
            createIndicators();
            updateCarousel();
        });

        // Inicializar
        createIndicators();
        updateCarousel();