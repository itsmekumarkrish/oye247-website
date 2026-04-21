document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Elements
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotOptions = document.getElementById('chatbot-options');
    const waCtaArea = document.getElementById('wa-cta-area');

    // Toggle Chatbot
    chatbotTrigger.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if(chatbotWindow.classList.contains('active')) {
            // Optional: reset chat if needed, but keeping state is fine for now
            setTimeout(() => {
                chatbotWindow.style.display = 'flex';
            }, 10);
        } else {
            setTimeout(() => {
                chatbotWindow.style.display = 'none';
            }, 300); // match transition duration
        }
    });

    closeChatBtn.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        setTimeout(() => {
            chatbotWindow.style.display = 'none';
        }, 300);
    });

    // Setup initial state for display toggle properly
    chatbotWindow.style.display = 'none';
    
    // Add event listener to the trigger to handle the block vs none display issue with transitions
    chatbotTrigger.addEventListener('click', (e) => {
        if(chatbotWindow.style.display === 'none') {
            chatbotWindow.style.display = 'flex';
            // Trigger reflow to ensure transition happens
            void chatbotWindow.offsetWidth; 
            chatbotWindow.classList.add('active');
        } else {
            chatbotWindow.classList.remove('active');
            setTimeout(() => {
                chatbotWindow.style.display = 'none';
            }, 300);
        }
    });

    // Remove the duplicate listener above, just overriding it here to be safe
    chatbotTrigger.replaceWith(chatbotTrigger.cloneNode(true));
    const newChatbotTrigger = document.getElementById('chatbot-trigger');
    
    newChatbotTrigger.addEventListener('click', () => {
        if(chatbotWindow.classList.contains('active')) {
            chatbotWindow.classList.remove('active');
            setTimeout(() => {
                chatbotWindow.style.display = 'none';
            }, 300);
        } else {
            chatbotWindow.style.display = 'flex';
            setTimeout(() => {
                chatbotWindow.classList.add('active');
            }, 10);
        }
    });

    // Chatbot Flow Logic
    const chatFlow = {
        question1: {
            bot: "Great! What industry are you in?",
            options: ["E-commerce", "SaaS / Tech", "Service Based", "Other"]
        },
        question2: {
            bot: "Got it. How many leads do you typically get per month?",
            options: ["Under 50", "50 - 200", "200+"]
        },
        final: {
            bot: "Awesome. Our AI can definitely help you increase conversions. Let's chat on WhatsApp to see a quick demo tailored for you.",
            options: [] // no options, show WA button
        }
    };

    let currentStep = 0;

    // Handle Option Clicks
    chatbotOptions.addEventListener('click', (e) => {
        if(e.target.classList.contains('chat-option-btn')) {
            const userReply = e.target.getAttribute('data-reply');
            addUserMessage(userReply);
            
            // Disable options temporarily
            chatbotOptions.innerHTML = '';
            
            // Determine next bot message
            setTimeout(() => {
                if(currentStep === 0) {
                    addBotMessage(chatFlow.question1.bot);
                    renderOptions(chatFlow.question1.options);
                    currentStep++;
                } else if (currentStep === 1) {
                    addBotMessage(chatFlow.question2.bot);
                    renderOptions(chatFlow.question2.options);
                    currentStep++;
                } else if (currentStep === 2) {
                    addBotMessage(chatFlow.final.bot);
                    waCtaArea.style.display = 'block';
                    currentStep++;
                }
            }, 800);
        }
    });

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message user-message';
        msgDiv.textContent = text;
        chatbotBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function addBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message bot-message';
        msgDiv.textContent = text;
        chatbotBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function renderOptions(optionsArray) {
        chatbotOptions.innerHTML = '';
        optionsArray.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.setAttribute('data-reply', opt);
            btn.textContent = opt;
            chatbotOptions.appendChild(btn);
        });
    }

    function scrollToBottom() {
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    // Smooth Scroll Offset for Navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                const headerOffset = 100; // approximate navbar height + breathing room
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
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
        heroSection.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        heroSection.addEventListener('mouseleave', () => {
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

    // --- AI Smart Input Logic (Refactored for Multiple Instances) ---
    function initSmartInput(container) {
        const rawInput = container.querySelector('input[type="text"]');
        const detectedInput = container.querySelector('input[type="hidden"]');
        const suggestionsBox = container.querySelector('.ai-suggestions-box');
        const list = container.querySelector('.suggestion-list');
        const chips = container.querySelector('.quick-suggestions');

        const businessDictionary = {
            'Real Estate': ['home', 'house', 'property', 'realtor', 'agent', 'broker', 'land', 'apartment'],
            'E-commerce': ['store', 'shop', 'online', 'sell', 'product', 'clothes', 'ecommerce', 'dropshipping'],
            'SaaS / Software': ['app', 'software', 'platform', 'tech', 'saas', 'startup', 'web', 'dev'],
            'Marketing Agency': ['ads', 'marketing', 'social', 'branding', 'agency', 'seo', 'leads'],
            'Healthcare': ['doctor', 'clinic', 'medical', 'health', 'dental', 'patient', 'hospital'],
            'Law Firm': ['law', 'legal', 'attorney', 'lawyer', 'firm', 'court'],
            'Restaurant': ['food', 'cafe', 'restaurant', 'coffee', 'bakery', 'kitchen', 'delivery'],
            'Fitness / Gym': ['gym', 'fitness', 'workout', 'trainer', 'coach', 'yoga', 'studio'],
            'Education / Coaching': ['school', 'coach', 'teaching', 'online course', 'training', 'institute', 'tutor'],
            'Logistics / Transport': ['delivery', 'transport', 'shipping', 'truck', 'warehouse', 'logistics']
        };

        function getAiSuggestions(query) {
            if (!query || query.length < 2) return [];
            const normalized = query.toLowerCase();
            const matches = [];
            for (const [category, keywords] of Object.entries(businessDictionary)) {
                let score = 0;
                if (category.toLowerCase().includes(normalized)) score += 10;
                keywords.forEach(kw => {
                    if (normalized.includes(kw)) score += 5;
                    if (kw.includes(normalized)) score += 2;
                });
                if (score > 0) matches.push({ category, score });
            }
            return matches.sort((a, b) => b.score - a.score).slice(0, 5);
        }

        if (rawInput) {
            rawInput.addEventListener('input', (e) => {
                const query = e.target.value;
                if (query.length > 0) chips?.classList.add('hidden');
                else chips?.classList.remove('hidden');

                const suggestions = getAiSuggestions(query);
                if (suggestions.length > 0) {
                    list.innerHTML = suggestions.map(s => `
                        <li class="suggestion-item" data-category="${s.category}">
                            <span>${s.category.replace(new RegExp(query, 'gi'), match => `<strong>${match}</strong>`)}</span>
                            <span class="match-percent">${Math.min(99, 70 + s.score)}% match</span>
                        </li>
                    `).join('');
                    suggestionsBox.classList.add('active');
                } else {
                    suggestionsBox.classList.remove('active');
                }
                detectedInput.value = suggestions.length > 0 ? suggestions[0].category : 'Other';
                checkFormValidity(container.closest('form'));
            });

            list?.addEventListener('click', (e) => {
                const item = e.target.closest('.suggestion-item');
                if (item) {
                    const cat = item.getAttribute('data-category');
                    rawInput.value = cat;
                    detectedInput.value = cat;
                    suggestionsBox.classList.remove('active');
                    container.closest('.floating-group')?.classList.add('valid');
                    checkFormValidity(container.closest('form'));
                }
            });

            chips?.addEventListener('click', (e) => {
                const chip = e.target.closest('.chip');
                if (chip) {
                    const val = chip.textContent;
                    rawInput.value = val;
                    detectedInput.value = val;
                    chips.classList.add('hidden');
                    container.closest('.floating-group')?.classList.add('valid');
                    checkFormValidity(container.closest('form'));
                }
            });

            document.addEventListener('click', (e) => {
                if (!rawInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                    suggestionsBox.classList.remove('active');
                }
            });
        }
    }

    document.querySelectorAll('.smart-ai-input-wrapper').forEach(initSmartInput);

    // --- Unified Validation Logic ---
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function checkFormValidity(form) {
        if (!form) return;
        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const emailInput = form.querySelector('input[name="email"]');
        const aiCategory = form.querySelector('input[name="business_category"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        const nameValid = nameInput && nameInput.value.trim().length >= 2;
        const phoneValid = phoneInput && phoneInput.value.trim().length >= 6;
        const businessValid = aiCategory && aiCategory.value !== "";

        if (nameInput) updateFieldValidation(nameInput, nameValid);
        if (phoneInput) updateFieldValidation(phoneInput, phoneValid);
        if (emailInput) updateFieldValidation(emailInput, emailInput.value.trim() === '' || isValidEmail(emailInput.value.trim()));

        if (submitBtn) {
            submitBtn.disabled = !(nameValid && phoneValid && businessValid);
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

    // Enable/disable submit button + update checkmarks
    function checkFormValidity() {
        const nameValid = nameInput && nameInput.value.trim().length >= 2;
        const phoneValid = phoneInput && phoneInput.value.trim().length >= 6;
        const businessValid = aiDetectedCategory && aiDetectedCategory.value !== "";
        
        if (nameInput) updateFieldValidation(nameInput, nameValid);
        if (phoneInput) updateFieldValidation(phoneInput, phoneValid);
        if (emailInput) updateFieldValidation(emailInput, emailInput.value.trim() === '' || isValidEmail(emailInput.value.trim()));
        
        // Custom validation for AI field
        if (businessRawInput) {
            const group = businessRawInput.closest('.floating-group');
            if (group) {
                if (businessValid && businessRawInput.value.trim().length > 0) {
                    group.classList.add('valid');
                } else {
                    group.classList.remove('valid');
                }
            }
        }

        if (submitBtn) {
            submitBtn.disabled = !(nameValid && phoneValid && businessValid);
        }
    }

    // Listen for input on all fields
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            nameInput.classList.remove('error');
            checkFormValidity();
        });
    }
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            phoneInput.classList.remove('error');
            checkFormValidity();
        });
    }
    if (emailInput) {
        emailInput.addEventListener('input', checkFormValidity);
    }

    // --- Unified Form Submission Logic ---
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = form.querySelector('input[name="name"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            const emailInput = form.querySelector('input[name="email"]');
            const businessRaw = form.querySelector('input[name="business_description"]');
            const businessCat = form.querySelector('input[name="business_category"]');
            const leadsSelect = form.querySelector('select[name="leads"]');
            const messageInput = form.querySelector('textarea[name="message"]');
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn?.querySelector('#btn-text') || submitBtn;
            const btnLoading = submitBtn?.querySelector('#btn-loading');

            const formData = {
                name: nameInput?.value.trim(),
                phone: phoneInput?.value.trim(),
                email: emailInput?.value.trim() || '',
                business_raw: businessRaw?.value.trim() || '',
                business_category: businessCat?.value || '',
                leads: leadsSelect?.value || '',
                message: messageInput?.value.trim() || ''
            };

            // Loading state
            if (btnLoading) {
                if (btnText) btnText.style.display = 'none';
                btnLoading.style.display = 'inline-flex';
            }
            if (submitBtn) submitBtn.disabled = true;

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showSuccess(form);
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                // Fallback for offline/local development
                showSuccess(form);
                console.log('Form submitted (Offline):', formData);
            }
        });
    });

    function showSuccess(form) {
        // If modal form
        if (form.id === 'contact-form') {
            const formWrap = document.getElementById('contact-form-wrap');
            const successWrap = document.getElementById('contact-success');
            if (formWrap) formWrap.style.display = 'none';
            if (successWrap) successWrap.style.display = 'block';
        } else {
            // Static form - replace with message
            const card = form.closest('.contact-form-card');
            if (card) {
                card.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <div class="success-checkmark" style="margin-bottom: 1.5rem;">
                            <div class="success-ring"></div>
                            <i class="ph ph-check" style="font-size: 2rem; color: var(--accent-teal);"></i>
                        </div>
                        <h3 style="margin-bottom: 1rem;">Success! 🎉</h3>
                        <p style="color: rgba(255,255,255,0.7);">Your automation plan request has been received. We'll be in touch shortly!</p>
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
