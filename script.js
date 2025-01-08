// 页面滚动动画
document.addEventListener('DOMContentLoaded', () => {
    // 监听滚动事件
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s ease-out';
        observer.observe(section);
    });

    // 添加导航栏平滑滚动
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 添加技能条动画
    const skillLevels = document.querySelectorAll('.skill-level');
    skillLevels.forEach(skill => {
        const width = skill.style.width;
        skill.style.width = '0';
        setTimeout(() => {
            skill.style.width = width;
        }, 200);
    });

    // 添加留言功能
    const messageForm = document.getElementById('messageForm');
    const messagesList = document.querySelector('.messages-list');

    // 存储留言的数组
    let messages = [];

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // 创建新留言对象
        const newMessage = {
            id: Date.now(),
            name,
            email,
            message,
            time: new Date().toLocaleString()
        };
        
        // 添加到留言数组
        messages.unshift(newMessage);
        
        // 更新显示
        updateMessages();
        
        // 重置表单
        messageForm.reset();
    });

    function updateMessages() {
        messagesList.innerHTML = messages.map(msg => `
            <div class="message-item">
                <div class="message-header">
                    <span>${msg.name}</span>
                    <span class="message-time">${msg.time}</span>
                </div>
                <div class="message-content">${msg.message}</div>
            </div>
        `).join('');
    }
});

// 添加故障文字效果
const glitchText = document.querySelector('.glitch');
if (glitchText) {
    setInterval(() => {
        glitchText.style.animation = 'none';
        void glitchText.offsetWidth;
        glitchText.style.animation = 'glitch 500ms infinite';
    }, 2500);
}

// 轮播图功能
function initCarousel() {
    const wrapper = document.querySelector('.carousel-wrapper');
    const slides = Array.from(wrapper.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    // 初始化轮播状态
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            } else if (index === (currentIndex + 1) % slides.length) {
                slide.classList.add('next');
            }
        });

        // 更新指示点
        const dots = Array.from(dotsNav.children);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // 创建指示点
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dotsNav.appendChild(dot);
    });

    // 点击事件处理
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
    });

    dotsNav.addEventListener('click', e => {
        const dot = e.target.closest('button');
        if (!dot) return;

        const dotIndex = Array.from(dotsNav.children).indexOf(dot);
        if (dotIndex !== -1) {
            currentIndex = dotIndex;
            updateSlides();
        }
    });

    // 自动播放
    let autoplayInterval;
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlides();
        }, 5000);
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);

    // 初始化显示
    updateSlides();
    startAutoplay();
}

// 页面加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', initCarousel); 