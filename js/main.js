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

        // Cargar clientes desde JSON
        async function loadClients() {
            try {
                const response = await fetch('assets/data/clients.json');
                const data = await response.json();
                const track = document.getElementById('carouselTrack');
                
                // Renderizar cada cliente
                data.clients.forEach(client => {
                    const clientCard = document.createElement('div');
                    clientCard.className = 'client-card';
                    clientCard.innerHTML = `<img src="${client.image}" alt="${client.alt}" />`;
                    track.appendChild(clientCard);
                });
                
                // Agregar tarjeta con total de clientes
                const moreCard = document.createElement('div');
                moreCard.className = 'client-card client-more';
                moreCard.textContent = `+${data.totalClients} clientes`;
                track.appendChild(moreCard);
                
                // Inicializar carousel después de cargar los datos
                initClientsCarousel();
            } catch (error) {
                console.error('Error al cargar clientes:', error);
            }
        }

        // Llamar a la función para cargar clientes
        loadClients();

        function initClientsCarousel() {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicatorsContainer = document.getElementById('indicators');
        const cards = track.querySelectorAll('.client-card');
        
        let currentIndex = 0;
        let cardsToShow = getCardsToShow();
        const totalCards = cards.length;
let isTransitioning = false;

        function getCardsToShow() {
            const width = window.innerWidth;
            if (width < 480) return 1;
            if (width < 768) return 2;
            if (width < 1024) return 3;
            return 4;
        }

// Clonar cards para efecto infinito
function createInfiniteCards() {
    // Limpiar clones existentes
    track.querySelectorAll('.clone').forEach(clone => clone.remove());

    // Clonar todas las cards al final
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        track.appendChild(clone);
    });

    // Clonar todas las cards al inicio
    for (let i = totalCards - 1; i >= 0; i--) {
        const clone = cards[i].cloneNode(true);
        clone.classList.add('clone');
        track.insertBefore(clone, track.firstChild);
    }

    // Ajustar posición inicial
    currentIndex = totalCards;
    updateCarouselPosition(false);
}

function updateCarouselPosition(withTransition = true) {
    const allCards = track.querySelectorAll('.client-card');
    if (allCards.length === 0) return;
    
    const cardWidth = allCards[0].offsetWidth;
    const gap = 24; // 1.5rem
    const offset = currentIndex * (cardWidth + gap);

    track.style.transition = withTransition ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
}

function updateCarousel() {
    if (isTransitioning) return;
            
    updateCarouselPosition(true);
            updateIndicators();
        }

        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            
            for (let i = 0; i < totalCards; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                indicator.addEventListener('click', () => {
                    if (isTransitioning) return;
                    currentIndex = i + totalCards;
                    updateCarousel();
                    handleInfiniteTransition();
                });
                indicatorsContainer.appendChild(indicator);
            }
        }

        function updateIndicators() {
            const indicators = indicatorsContainer.querySelectorAll('.indicator');
            const realIndex = (currentIndex - totalCards + totalCards) % totalCards;
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === realIndex);
            });
}

function handleInfiniteTransition() {
    isTransitioning = true;

    const handleTransitionEnd = () => {
        track.removeEventListener('transitionend', handleTransitionEnd);

        // Si llegamos al final (últimos clones)
        if (currentIndex >= totalCards * 2) {
            currentIndex = totalCards;
            updateCarouselPosition(false);
        }
        // Si llegamos al principio (primeros clones)
        else if (currentIndex <= 0) {
            currentIndex = totalCards;
            updateCarouselPosition(false);
        }

        isTransitioning = false;
        updateIndicators();
    };

    track.addEventListener('transitionend', handleTransitionEnd);
}

        prevBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex--;
            updateCarousel();
            handleInfiniteTransition();
        });

        nextBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex++;
            updateCarousel();
            handleInfiniteTransition();
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
            if (touchEndX < touchStartX - 50) {
                if (isTransitioning) return;
                currentIndex++;
                updateCarousel();
                handleInfiniteTransition();
            }
            if (touchEndX > touchStartX + 50) {
                if (isTransitioning) return;
                currentIndex--;
                updateCarousel();
                handleInfiniteTransition();
            }
        }

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                if (isTransitioning) return;
                currentIndex--;
                updateCarousel();
                handleInfiniteTransition();
            }
            if (e.key === 'ArrowRight') {
                if (isTransitioning) return;
                currentIndex++;
                updateCarousel();
                handleInfiniteTransition();
            }
        });

// Auto-play opcional
        let autoPlayInterval = setInterval(() => {
            if (isTransitioning) return;
            currentIndex++;
            updateCarousel();
            handleInfiniteTransition(); 
        }, 3000);

        track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        track.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                if (isTransitioning) return;
                currentIndex++;
                updateCarousel();
                handleInfiniteTransition();
            }, 3000);
        });

        // Responsive
        window.addEventListener('resize', () => {
            cardsToShow = getCardsToShow();
            createInfiniteCards();
            createIndicators();
            updateCarousel();
        });

        // Inicializar
        createInfiniteCards();
        createIndicators();
        updateCarousel();
        } // Fin de initClientsCarousel()

// ====== TEAM CAROUSEL FUNCTIONALITY ======
const teamTrack = document.getElementById('teamCarouselTrack');
const teamPrevBtn = document.getElementById('teamPrevBtn');
const teamNextBtn = document.getElementById('teamNextBtn');
const teamIndicatorsContainer = document.getElementById('teamIndicators');
const teamCards = teamTrack.querySelectorAll('.team-card');

let teamCurrentIndex = 0;
let teamCardsToShow = getTeamCardsToShow();
const teamTotalCards = teamCards.length;
let teamIsTransitioning = false;

function getTeamCardsToShow() {
    const width = window.innerWidth;
    if (width < 480) return 1;
    if (width < 768) return 2;
    if (width < 1200) return 3;
    return 4;
}

// Clonar cards para efecto infinito del equipo
function createInfiniteTeamCards() {
    // Limpiar clones existentes
    teamTrack.querySelectorAll('.clone').forEach(clone => clone.remove());

    // Clonar todas las cards al final
    teamCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        teamTrack.appendChild(clone);
    });

    // Clonar todas las cards al inicio
    for (let i = teamTotalCards - 1; i >= 0; i--) {
        const clone = teamCards[i].cloneNode(true);
        clone.classList.add('clone');
        teamTrack.insertBefore(clone, teamTrack.firstChild);
    }

    // Ajustar posición inicial
    // En móviles (1 card visible), empezar en la card #2 (Amado David Oviedo)
    if (teamCardsToShow === 1) {
        teamCurrentIndex = teamTotalCards + 1; // Empieza en card #2 (índice 1)
    } else {
        teamCurrentIndex = teamTotalCards; // Empieza en card #1 en otros tamaños
    }
    updateTeamCarouselPosition(false);
}

function updateTeamCarouselPosition(withTransition = true) {
    const allCards = teamTrack.querySelectorAll('.team-card');
    if (allCards.length === 0) return;
    
    const cardWidth = allCards[0].offsetWidth;
    const gap = 24; // 1.5rem
    const offset = teamCurrentIndex * (cardWidth + gap);

    teamTrack.style.transition = withTransition ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    teamTrack.style.transform = `translateX(-${offset}px)`;
}

function updateTeamCarousel() {
    if (teamIsTransitioning) return;

    updateTeamCarouselPosition(true);
    updateTeamIndicators();
}

function handleTeamInfiniteTransition() {
    teamIsTransitioning = true;

    const handleTransitionEnd = () => {
        teamTrack.removeEventListener('transitionend', handleTransitionEnd);

        // Si llegamos al final (últimos clones)
        if (teamCurrentIndex >= teamTotalCards * 2) {
            teamCurrentIndex = teamTotalCards;
            updateTeamCarouselPosition(false);
        }
        // Si llegamos al principio (primeros clones)
        else if (teamCurrentIndex <= 0) {
            teamCurrentIndex = teamTotalCards;
            updateTeamCarouselPosition(false);
        }

        teamIsTransitioning = false;
        updateTeamIndicators();
    };

    teamTrack.addEventListener('transitionend', handleTransitionEnd);
}

function createTeamIndicators() {
    teamIndicatorsContainer.innerHTML = '';

    for (let i = 0; i < teamTotalCards; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        indicator.addEventListener('click', () => {
            if (teamIsTransitioning) return;
            teamCurrentIndex = i + teamTotalCards;
            updateTeamCarousel();
            handleTeamInfiniteTransition();
        });
        teamIndicatorsContainer.appendChild(indicator);
    }
}

function updateTeamIndicators() {
    const indicators = teamIndicatorsContainer.querySelectorAll('.indicator');
    const realIndex = (teamCurrentIndex - teamTotalCards + teamTotalCards) % teamTotalCards;
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === realIndex);
    });
}

teamPrevBtn.addEventListener('click', () => {
    if (teamIsTransitioning) return;
    teamCurrentIndex--;
    updateTeamCarousel();
    handleTeamInfiniteTransition();
});

teamNextBtn.addEventListener('click', () => {
    if (teamIsTransitioning) return;
    teamCurrentIndex++;
    updateTeamCarousel();
    handleTeamInfiniteTransition();
});

// Soporte para deslizamiento táctil en team carousel
let teamTouchStartX = 0;
let teamTouchEndX = 0;

teamTrack.addEventListener('touchstart', (e) => {
    teamTouchStartX = e.changedTouches[0].screenX;
});

teamTrack.addEventListener('touchend', (e) => {
    teamTouchEndX = e.changedTouches[0].screenX;
    handleTeamSwipe();
});

function handleTeamSwipe() {
    if (teamTouchEndX < teamTouchStartX - 50) {
        if (teamIsTransitioning) return;
        teamCurrentIndex++;
        updateTeamCarousel();
        handleTeamInfiniteTransition();
    }
    if (teamTouchEndX > teamTouchStartX + 50) {
        if (teamIsTransitioning) return;
        teamCurrentIndex--;
        updateTeamCarousel();
        handleTeamInfiniteTransition();
    }
}

// Responsive para team carousel
window.addEventListener('resize', () => {
    teamCardsToShow = getTeamCardsToShow();
    createInfiniteTeamCards();
    createTeamIndicators();
    updateTeamCarousel();
});

// Inicializar team carousel
createInfiniteTeamCards();
createTeamIndicators();
updateTeamCarousel();