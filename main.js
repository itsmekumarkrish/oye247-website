document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Elements
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    // Toggle Chatbot
    if (chatbotTrigger && chatbotWindow) {
        chatbotTrigger.addEventListener('click', () => {
            if (chatbotWindow.style.display === 'none' || !chatbotWindow.style.display) {
                chatbotWindow.style.display = 'flex';
                void chatbotWindow.offsetWidth; 
                chatbotWindow.classList.add('active');
            } else {
                chatbotWindow.classList.remove('active');
                setTimeout(() => {
                    chatbotWindow.style.display = 'none';
                }, 300);
            }
        });
    }

    if (closeChatBtn && chatbotWindow) {
        closeChatBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            setTimeout(() => {
                chatbotWindow.style.display = 'none';
            }, 300);
        });
    }

    // Chat Message Logic
    function addMessage(text, sender = 'bot') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}-message`;
        
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        
        msgDiv.innerHTML = `
            <div class="msg-content">${text}</div>
            <div class="msg-time">${time}</div>
        `;
        
        chatbotBody.appendChild(msgDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        addMessage(text, 'user');
        chatInput.value = '';
        
        // Simple Bot Response Simulation
        setTimeout(() => {
            let response = "I'm processing that for you. Would you like to see a custom demo of how our AI can help your specific business?";
            if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
                response = "Our automation plans are customized based on your business volume. I can get you a personalized quote if you share your business type!";
            } else if (text.toLowerCase().includes('hi') || text.toLowerCase().includes('hello')) {
                response = "Hello! I'm the OyeHQ AI assistant. How can I help you automate your growth today?";
            }
            addMessage(response, 'bot');
        }, 1000);
    }

    if (chatSend) chatSend.addEventListener('click', handleChat);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    // Smooth Scroll Offset for Navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Canvas Animated Background ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null };
        let orbs = [];

        function resize() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // Track mouse for parallax
        const heroSection = document.querySelector('.hero');
        if(heroSection)heroSection.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        if(heroSection)heroSection.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Orbs for background gradient glow
        class Orb {
            constructor(x, y, r, color, vx, vy) {
                this.x = x;
                this.y = y;
                this.r = r;
                this.color = color;
                this.vx = vx;
                this.vy = vy;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -this.r || this.x > width + this.r) this.vx *= -1;
                if (this.y < -this.r || this.y > height + this.r) this.vy *= -1;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = 0.4; // even softer glow
                const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
                g.addColorStop(0, this.color);
                g.addColorStop(1, 'rgba(10, 10, 15, 0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize orbs with requested colors - larger radius, lower opacity, slower speed
        // Teal, Purple, Blue
        orbs.push(new Orb(width * 0.2, height * 0.3, 350, 'rgba(20, 241, 217, 0.06)', 0.15, 0.1)); 
        orbs.push(new Orb(width * 0.8, height * 0.6, 450, 'rgba(139, 92, 246, 0.06)', -0.1, 0.15)); 
        orbs.push(new Orb(width * 0.5, height * 0.8, 300, 'rgba(59, 130, 246, 0.06)', 0.1, -0.1)); 

        // Particles
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.15; // slow movement
                this.vy = (Math.random() - 0.5) * 0.15;
                this.radius = Math.random() * 1.2 + 0.5; // slightly smaller
                this.baseX = this.x;
                this.baseY = this.y;
            }
            update() {
                this.baseX += this.vx;
                this.baseY += this.vy;

                // wrap around
                if (this.baseX < 0) this.baseX = width;
                if (this.baseX > width) this.baseX = 0;
                if (this.baseY < 0) this.baseY = height;
                if (this.baseY > height) this.baseY = 0;

                // parallax
                if (mouse.x != null) {
                    let dx = mouse.x - width/2;
                    let dy = mouse.y - height/2;
                    // gentle shift opposite to mouse
                    this.x = this.baseX - dx * 0.015; // subtle parallax
                    this.y = this.baseY - dy * 0.015;
                } else {
                    this.x = this.baseX;
                    this.y = this.baseY;
                }
            }
            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Less particles on mobile for performance and subtlety
        const numParticles = window.innerWidth < 768 ? 20 : 50;
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw Orbs
            orbs.forEach(orb => {
                orb.update();
                orb.draw();
            });

            // Draw Particles and connecting lines
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist/120)})`; // softer lines
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }


    // --- Trusted Logos Canvas ---
    const logosCanvas = document.getElementById('logos-canvas');
    if (logosCanvas) {
        const ctxL = logosCanvas.getContext('2d');
        let widthL, heightL;
        let stars = [];

        function resizeL() {
            widthL = logosCanvas.width = logosCanvas.parentElement.offsetWidth;
            heightL = logosCanvas.height = logosCanvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resizeL);
        resizeL();

        class Star {
            constructor() {
                this.x = Math.random() * widthL;
                this.y = Math.random() * heightL;
                this.vx = (Math.random() - 0.5) * 0.1;
                this.vy = (Math.random() - 0.5) * 0.1;
                this.radius = Math.random() * 1.2;
                this.alpha = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = widthL;
                if (this.x > widthL) this.x = 0;
                if (this.y < 0) this.y = heightL;
                if (this.y > heightL) this.y = 0;
            }
            draw() {
                ctxL.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctxL.beginPath();
                ctxL.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctxL.fill();
            }
        }

        const numStars = window.innerWidth < 768 ? 15 : 30;
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }

        function animateL() {
            ctxL.clearRect(0, 0, widthL, heightL);
            stars.forEach(s => {
                s.update();
                s.draw();
            });
            requestAnimationFrame(animateL);
        }
        animateL();
    }

    // --- Intersection Observer for Scroll Animations ---
    const fadeUpElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    fadeUpElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = '0';
            });
            
            // Toggle clicked FAQ
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- Modal Logic ---
    const contactModal = document.getElementById('contact-modal');
    const openModalBtns = document.querySelectorAll('.open-contact-modal');
    const closeModalBtn = contactModal ? contactModal.querySelector('.modal-close') : null;

    function openModal(mode = 'automation') {
        if(contactModal) {
            const titleEl = contactModal.querySelector('.form-title');
            const subtitleEl = contactModal.querySelector('.form-subtitle');
            const modeInput = document.getElementById('form-mode-input');
            const submitBtnText = document.getElementById('btn-text');

            if (mode === 'demo') {
                if (titleEl) titleEl.textContent = 'Get a Live AI Demo';
                if (subtitleEl) subtitleEl.textContent = 'See how our AI agents can transform your business in real-time.';
                if (submitBtnText) submitBtnText.innerHTML = 'Get My Live Demo <i class="ph ph-arrow-right"></i>';
                if (modeInput) modeInput.value = 'demo';
            } else {
                if (titleEl) titleEl.textContent = 'Get Your Automation Plan';
                if (subtitleEl) subtitleEl.textContent = 'Fill in the details below to receive your custom automation roadmap.';
                if (submitBtnText) submitBtnText.innerHTML = 'Get Your Automation Plan <i class="ph ph-arrow-right"></i>';
                if (modeInput) modeInput.value = 'automation';
            }


            contactModal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }

    function closeModal() {
        if(contactModal) {
            contactModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const mode = btn.getAttribute('data-mode') || 'automation';
            openModal(mode);
        });
    });

    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal on background click
    if(contactModal) {
        contactModal.addEventListener('click', (e) => {
            if(e.target === contactModal) {
                closeModal();
            }
        });
    }



    // --- Unified Validation Logic ---
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function checkFormValidity(form) {
        if (!form) return;
        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const emailInput = form.querySelector('input[name="email"]');
        const businessInput = form.querySelector('input[name="business"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        const nameValid = nameInput && nameInput.value.trim().length >= 2;
        const phoneValid = phoneInput && phoneInput.value.trim().length >= 6;
        const businessValid = businessInput && businessInput.value !== "";

        const emailValid = emailInput && isValidEmail(emailInput.value.trim());

        if (nameInput) updateFieldValidation(nameInput, nameValid);
        if (phoneInput) updateFieldValidation(phoneInput, phoneValid);
        if (emailInput) updateFieldValidation(emailInput, emailValid);

        if (submitBtn) {
            submitBtn.disabled = !(nameValid && phoneValid && businessValid && emailValid);
        }
    }

    function updateFieldValidation(input, isValid) {
        const group = input.closest('.floating-group');
        if (!group) return;
        if (isValid && input.value.trim().length > 0) {
            group.classList.add('valid');
            input.classList.remove('error');
        } else {
            group.classList.remove('valid');
        }
    }

    // Attach listeners to all forms
    document.querySelectorAll('form').forEach(form => {
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => checkFormValidity(form));
        });
        form.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', () => checkFormValidity(form));
        });
    });

    // --- Unified Form Submission Logic ---
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            if (form.id === 'chatbot-form') return; // skip chatbot for now
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn?.querySelector('#btn-text') || submitBtn;
            const btnLoading = submitBtn?.querySelector('#btn-loading');

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Loading state
            if (btnLoading) {
                if (btnText) btnText.style.display = 'none';
                btnLoading.style.display = 'inline-flex';
            }
            if (submitBtn) submitBtn.disabled = true;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showSuccess(form);
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                showSuccess(form);
                console.log('Form submitted (Offline):', data);
            }
        });
    });

    function showSuccess(form) {
        if (form.id === 'contact-form') {
            const formWrap = document.getElementById('contact-form-wrap');
            const successWrap = document.getElementById('contact-success');
            if (formWrap) formWrap.style.display = 'none';
            if (successWrap) successWrap.style.display = 'block';
        } else {
            const card = form.closest('.contact-form-card') || form.parentElement;
            if (card) {
                card.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <i class="ph ph-check-circle" style="font-size: 3rem; color: var(--accent-teal); margin-bottom: 1rem; display: block;"></i>
                        <h3>Success! 🎉</h3>
                        <p style="color: rgba(255,255,255,0.7);">Your request has been received. We'll be in touch shortly!</p>
                    </div>
                `;
            }
        }
    }
});


// Mobile Navigation Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-links a');

if (mobileMenuBtn && mobileNav && mobileMenuClose) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    mobileMenuClose.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}
