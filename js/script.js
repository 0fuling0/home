// 定义深色模式和浅色模式的颜色
const DARK_MODE_COLOR = '#272a29';
const LIGHT_MODE_COLOR = '#cfd2d1';

// 定义背景图片和轮播图片的索引
let currentBackgroundImageIndex = 0;
let currentCarouselIndex = 0;

// 定义背景图片和轮播图片的数组
let backgroundImages = [
    'img/0.jpg',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg'
];
let carouselImages = [
    'img/ComfyUI_00122_.png',
    'img/ComfyUI_00121_.png',
    'img/ComfyUI_00094_.png',
    'img/ComfyUI_00086_.png',
    'img/ComfyUI_00079_.png',
    'img/ComfyUI_00082_.png',
    'img/ComfyUI_00085_.png'
];

// 定义自动轮播和背景图片切换的定时器
let autoSlideInterval;
let backgroundImageInterval;

// 页面加载时的事件处理
window.addEventListener('load', function () {
    // adjustFooter();
});

// DOM内容加载完成时的事件处理
document.addEventListener('DOMContentLoaded', function () {
    showLoading();
    
    // 首先初始化基本功能
    setInitialDarkMode();
    updateClock();
    initBackgroundImage();
    
    // 加载配置
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            window.siteConfig = config;
            
            // 初始化网站
            initSiteWithConfig(config);
            
            // 渲染主页卡片
            if (config.homepage && config.homepage.cards) {
                renderHomepageCards(config.homepage.cards);
            } else {
                console.error('Homepage cards configuration not found');
            }
            
            // 在所有内容加载完成后初始化其他功能
            initHitokoto();
            if (config.carousel) {
                carouselImages = config.carousel.images;
                initCarousel();
                startAutoSlide();
            }
        })
        .catch(error => {
            console.error('Error loading configuration:', error);
        })
        .finally(() => {
            hideLoading();
        });
});

// 显示加载动画
function showLoading() {
    document.querySelector('.loading-container').style.display = 'flex';
}
showLoading();

// 隐藏加载动画
function hideLoading() {
    document.querySelector('.loading-container').style.display = 'none';
}

// 删除原有的 adjustFooter 函数及其调用
// function adjustFooter() { /* ...existing code... */ }
// window.addEventListener('resize', adjustFooter);
// window.addEventListener('load', function () { adjustFooter(); });

// 初始化背景图片
function initBackgroundImage() {
    const body = document.body;
    const savedIndex = localStorage.getItem('backgroundImageIndex');
    if (savedIndex !== null) {
        currentBackgroundImageIndex = parseInt(savedIndex);
    }
    updateBackgroundImage();
    body.addEventListener('transitionend', function () {
        body.style.transition = '';
    });
}

// 更新背景图片
function updateBackgroundImage() {
    const body = document.body;
    body.style.transition = 'background-image 1.5s ease';
    body.style.backgroundImage = `url('${backgroundImages[currentBackgroundImageIndex]}')`;
    localStorage.setItem('backgroundImageIndex', currentBackgroundImageIndex);
}

// 切换到下一张背景图片
function nextBackgroundImage() {
    currentBackgroundImageIndex = (currentBackgroundImageIndex + 1) % backgroundImages.length;
    preloadNextBackgroundImage(updateBackgroundImage);
}

// 预加载下一张背景图片
function preloadNextBackgroundImage(callback) {
    const nextIndex = (currentBackgroundImageIndex + 1) % backgroundImages.length;
    const img = new Image();
    img.onload = callback;
    img.src = backgroundImages[nextIndex];
}

// 初始化轮播图
function initCarousel() {
    const carouselImg = document.querySelector('.carousel-img');
    if (!carouselImg) {
        console.warn('Carousel image element not found, waiting for homepage cards to render...');
        return; // 如果元素不存在，直接返回
    }
    
    showSlide(currentCarouselIndex);
    startAutoSlide();
    
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

// 显示指定索引的轮播图
function showSlide(index) {
    const img = document.querySelector('.carousel-img');
    if (!img) return; // 如果元素不存在，直接返回
    img.src = carouselImages[index];
}

// 切换到下一张轮播图
function nextSlide() {
    currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
    showSlide(currentCarouselIndex);
}

// 切换到上一张轮播图
function prevSlide() {
    currentCarouselIndex = (currentCarouselIndex - 1 + carouselImages.length) % carouselImages.length;
    showSlide(currentCarouselIndex);
}

// 开始自动轮播
function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 10000);
}

// 停止自动轮播
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// 切换深色模式
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    updateThemeColor(isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
}

// 更新主题颜色
function updateThemeColor(isDarkMode) {
    const themeColorMeta = document.getElementById('theme-color-meta');
    themeColorMeta.content = isDarkMode ? DARK_MODE_COLOR : LIGHT_MODE_COLOR;
}

// 设置初始的深色模式
function setInitialDarkMode() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'true' || (storedDarkMode === null && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        updateThemeColor(true);
        localStorage.setItem('darkMode', true);
    } else {
        updateThemeColor(false);
    }
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
        updateThemeColor(true);
        localStorage.setItem('darkMode', true);
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeColor(false);
        localStorage.setItem('darkMode', false);
    }
});

// 更新时钟
function updateClock() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateString = now.toLocaleDateString('zh-CN', options);
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour12: false
    });
    
    document.querySelectorAll('.clock').forEach(clockElement => {
        if (!clockElement.querySelector('.clock-date')) {
            clockElement.innerHTML = `
                <div class="clock-date"></div>
                <div class="clock-time"></div>
            `;
        }
        clockElement.querySelector('.clock-date').textContent = dateString;
        clockElement.querySelector('.clock-time').textContent = timeString;
    });
}
setInterval(updateClock, 1000);

// 返回顶部按钮点击事件
document.getElementById('backToTop').addEventListener('click', function () {
    scrollToPosition(0, 500);
});

// 返回底部按钮点击事件
document.getElementById('backToBottom').addEventListener('click', function () {
    const documentHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
    const windowHeight = window.innerHeight;
    const targetPosition = documentHeight - windowHeight;
    scrollToPosition(targetPosition, 700);
});

// 滚动到指定位置
function scrollToPosition(target, duration) {
    const start = window.scrollY;
    const distance = target - start;
    const startTime = performance.now();
    function scroll() {
        const currentTime = performance.now();
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
            requestAnimationFrame(scroll);
        }
    }
    requestAnimationFrame(scroll);
}

// 缓动函数
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

// 全局变量存储当前一言内容
let currentHitokoto = window.siteConfig?.hitokoto?.messages?.default || '你好，又见面了！';

// 初始化一言
function initHitokoto() {
    // 使用配置中的加载消息
    updateAllHitokotoContainers(window.siteConfig?.hitokoto?.messages?.loading || '正在加载一言...');
    getHitokoto();
    // 使用配置中的刷新间隔
    setInterval(getHitokoto, window.siteConfig?.hitokoto?.interval || 10000);
}

// 更新所有一言容器
function updateAllHitokotoContainers(content) {
    document.querySelectorAll('.hitokoto-container').forEach(container => {
        container.textContent = content;
    });
}

// 获取一言
function getHitokoto() {
    const url = window.siteConfig?.hitokoto?.url || 'https://v1.hitokoto.cn/';
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            currentHitokoto = data.from ? 
                `『${data.hitokoto}』—— ${data.from}` : 
                data.hitokoto;
            updateAllHitokotoContainers(currentHitokoto);
        })
        .catch(error => {
            console.error('Error fetching hitokoto:', error);
            updateAllHitokotoContainers(window.siteConfig?.hitokoto?.messages?.error || '获取一言失败，请稍后再试...');
        });
}

// 更新网站运行时间信息
function updateRuntimeInfo(startDate) {
    const currentDate = new Date();
    const startDateObj = new Date(startDate);
    
    let years = currentDate.getFullYear() - startDateObj.getFullYear();
    let months = currentDate.getMonth() - startDateObj.getMonth();
    let days = currentDate.getDate() - startDateObj.getDate();
    
    if (days < 0) {
        months--;
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += previousMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const yearString = years > 0 ? `${years} 年 ` : '';
    const monthString = months > 0 ? `${months} 月 ` : '';
    const dayString = `${days} 天`;
    
    const runtimeInfoContainer = document.getElementById('runtime-info-container');
    if (runtimeInfoContainer) {
        runtimeInfoContainer.innerHTML = `
            <strong>网站运行时间：</strong>
            ${yearString}${monthString}${dayString}
        `;
    }
}

// 初始化网站运行时间
function initRuntimeInfo(config) {
    if (config.siteInfo && config.siteInfo.startDate) {
        updateRuntimeInfo(config.siteInfo.startDate);
        // 每秒更新一次运行时间
        setInterval(() => {
            updateRuntimeInfo(config.siteInfo.startDate);
        }, 1000);
    }
}

// 初始化评论系统
twikoo.init({
    envId: 'https://twikoo.fuling.me/',
    el: '#tcomment',
});

// 显示指定的页面部分
function showSection(sectionId) {
    const sectionsToHide = ['homepage', 'navpage'];
    sectionsToHide.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = 'none';
        }
    });
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
        updateHeaderText(sectionId);
    } else {
        console.log(`Section with id ${sectionId} not found.`);
    }
    const mainElement = document.querySelector('main');
    mainElement.style.columnCount = (sectionId === 'navpage') ? '1' : '';
    // 删除或注释掉 footer 调整调用
    // adjustFooter();
}

// 更新页眉文本
function updateHeaderText(sectionId) {
    const headerTextElement = document.querySelector('header h1');
    if (headerTextElement) {
        switch (sectionId) {
            case 'homepage':
                headerTextElement.textContent = "Fuling's Homepage";
                break;
            case 'navpage':
                headerTextElement.textContent = "Fuling's Navigation";
                break;
            default:
                headerTextElement.textContent = "Fuling's Homepage";
                break;
        }
    }
}

// 初始化页面
function init() {
    const hash = window.location.hash.substring(1);
    if (hash === 'nav' || hash === 'home') {
        showSection(hash + 'page');
    } else {
        showSection('homepage');
    }
}
init();
window.addEventListener('hashchange', init);

// 定时器和当前卡片编号
let timer;
let currentCardNumber;

// 开始定时器
function startTimer(cardNumber) {
    timer = setTimeout(() => showCard(cardNumber), 500);
}

// 清除定时器
function clearTimer() {
    clearTimeout(timer);
}

// 显示指定编号的卡片
function showCard(cardNumber) {
    const cards = document.querySelectorAll('.cardItem');
    cards.forEach(card => card.classList.remove('active', 'current'));
    const selectedCard = document.getElementById(`card${cardNumber}`);
    selectedCard.classList.add('active', 'current');
    const oldNavButton = document.querySelector(`.navButton[data-card="${currentCardNumber}"]`);
    if (oldNavButton) {
        oldNavButton.classList.remove('current');
    }
    const newNavButton = document.querySelector(`.navButton[data-card="${cardNumber}"]`);
    if (newNavButton) {
        newNavButton.classList.add('current');
    }
    currentCardNumber = cardNumber;
}
document.querySelector('.navButton[data-card="1"]').classList.add('current');
currentCardNumber = 1;

// 切换到指定编号的卡片
function switchToCard(newCardNumber) {
    clearTimer();
    showCard(newCardNumber);
}
const cardItems = document.querySelectorAll('.cardItem');
cardItems.forEach(card => {
    card.addEventListener('click', function () {
        const cardNumber = parseInt(this.id.replace('card', ''), 10);
        switchToCard(cardNumber);
    });
});

// 网格项点击事件
document.addEventListener("DOMContentLoaded", function () {
    var gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(function (item) {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var url = item.getAttribute('data-url');
            window.open(url, '_blank');
        });
    });
});

// DOM内容加载完成时的事件处理
document.addEventListener('DOMContentLoaded', function () {
    var linkElements = document.querySelectorAll('.grid-item');
    var totalLinks = linkElements.length;
    var placeholdersNeeded = Math.max(0, 24 - totalLinks);
    for (var i = 0; i < placeholdersNeeded; i++) {
        var placeholder = document.createElement('div');
        placeholder.classList.add('grid-item', 'placeholder');
        placeholder.style.backgroundColor = 'transparent';
    }
});

// 切换搜索选项
function toggleOptions() {
    var options = document.getElementById('searchOptions');
    options.style.display = options.style.display === 'grid' ? 'none' : 'grid';
}

// 选择搜索选项
function selectOption(option) {
    document.querySelector('.select-styled').textContent = option;
    toggleOptions();
    // 立即记住选择的搜索引擎
    localStorage.setItem('lastSelectedEngine', option);
}

// 执行搜索
function search() {
    var selectedEngine = document.querySelector('.select-styled').textContent;
    var searchTerm = document.querySelector('.search-input').value;
    var searchURLs = {
        Google: 'https://www.google.com/search?q=',
        Bing: 'https://www.bing.com/search?q=',
        Yahoo: 'https://search.yahoo.com/search?p=',
        DuckDuckGo: 'https://duckduckgo.com/?q=',
        Baidu: 'https://www.baidu.com/s?wd=',
        Yandex: 'https://yandex.com/search/?text=',
        Ask: 'https://www.ask.com/web?q=',
        AOL: 'https://search.aol.com/aol/search?q=',
        WolframAlpha: 'https://www.wolframalpha.com/input/?i=',
        Dogpile: 'https://www.dogpile.com/search/web?q='
    };
    var searchURL = searchURLs[selectedEngine] + encodeURIComponent(searchTerm);
    window.open(searchURL, '_blank');

    // 记住最后选择的搜索引擎
    localStorage.setItem('lastSelectedEngine', selectedEngine);
}

// 页面加载时设置最后选择的搜索引擎
document.addEventListener('DOMContentLoaded', function () {
    var lastSelectedEngine = localStorage.getItem('lastSelectedEngine');
    if (lastSelectedEngine) {
        document.querySelector('.select-styled').textContent = lastSelectedEngine;
    }
});

// 搜索输入框按下回车键时执行搜索
document.querySelector('.search-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        search();
    }
});

// 加载配置
fetch('config.json')
    .then(response => response.json())
    .then(config => {
        initSiteWithConfig(config);
    })
    .catch(error => {
        console.error('Error loading config:', error);
    });

// 使用配置初始化网站
function initSiteWithConfig(config) {
    if (!config) {
        console.error('Configuration not loaded');
        return;
    }

    try {
        // 确保DOM加载完成后再执行
        document.addEventListener('DOMContentLoaded', () => {
            // 设置网站标题和格言
            if (config.siteInfo) {
                document.title = config.siteInfo.title;
                const mottoElement = document.querySelector('.motto');
                if (mottoElement) {
                    mottoElement.textContent = config.siteInfo.motto;
                }
                
                // 设置个人信息
                const profileImg = document.querySelector('.profile img');
                const profileName = document.querySelector('.profile-info h2');
                const profileNickname = document.querySelector('.profile-info p');
                
                if (profileImg) profileImg.src = config.siteInfo.avatar;
                if (profileName) profileName.textContent = config.siteInfo.profile.name;
                if (profileNickname) profileNickname.textContent = config.siteInfo.profile.nickname;
            }
            
            // 设置背景图片
            if (config.backgroundImages) {
                backgroundImages = config.backgroundImages.images;
                clearInterval(backgroundImageInterval);
                backgroundImageInterval = setInterval(nextBackgroundImage, config.backgroundImages.interval);
            }
            
            // 设置轮播图片
            if (config.carousel) {
                carouselImages = config.carousel.images;
                clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(nextSlide, config.carousel.interval);
            }
            
            // 初始化音乐播放器
            if (config.music && config.music.type === 'meting') {
                const musicContainer = document.querySelector('#aplayer');
                if (musicContainer) {
                    musicContainer.innerHTML = '';
                    const metingJs = document.createElement('meting-js');
                    Object.entries(config.music.settings).forEach(([key, value]) => {
                        metingJs.setAttribute(key, value);
                    });
                    musicContainer.appendChild(metingJs);
                }
            }
            
            // 初始化评论系统
            if (config.comments && config.comments.system === 'twikoo') {
                twikoo.init(config.comments.settings);
            }
            
            // 更新网站运行时间
            if (config.siteInfo && config.siteInfo.startDate) {
                const startDate = new Date(config.siteInfo.startDate);
                updateRuntimeInfo(startDate);
            }
            
            // 渲染项目列表
            if (config.projects) {
                const projectList = document.querySelector('.project-list');
                if (projectList) {
                    renderProjects(config.projects);
                }
            }

            // 渲染主页卡片
            if (config.homepage && config.homepage.cards) {
                renderHomepageCards(config.homepage.cards);
            }

            // 初始化网站运行时间
            initRuntimeInfo(config);
        });

    } catch (error) {
        console.error('Error initializing site with config:', error);
    }
}

// 渲染项目列表
function renderProjects(projects) {
    // 更精确选择 homepage 下的列表
    const projectList = document.querySelector('#homepage .project-list');
    if (!projectList) {
        console.warn('No .project-list found in #homepage, skipping render');
        return;
    }
    projectList.innerHTML = projects.map(project => `
        <li class="project">
            <a href="${project.url}" target="_blank">
                <i class="fab fa-${project.icon}"></i>
                <span>${project.name}</span>
            </a>
            <p>${project.description}</p>
        </li>
    `).join('');
}

// 渲染主页卡片
function renderHomepageCards(cards) {
    const homepage = document.getElementById('homepage');
    if (!homepage) return;
    
    homepage.innerHTML = '';

    cards.forEach(card => {
        const section = document.createElement('section');
        section.className = 'card';
        if (card.type) section.classList.add(card.type);

        switch (card.type) {
            case 'clock':
                section.innerHTML = `
                    <div class="clock">
                        <div class="clock-date"></div>
                        <div class="clock-time"></div>
                    </div>
                    <div class="hitokoto-container"></div>
                `;
                updateClock(); // 立即更新时钟显示
                break;

            case 'profile':
                section.innerHTML = `
                    <img src="${window.siteConfig.siteInfo.avatar}" alt="头像">
                    <div class="profile-info">
                        <h2>${window.siteConfig.siteInfo.profile.name}</h2>
                        <p>${window.siteConfig.siteInfo.profile.nickname}</p>
                    </div>
                    <div class="buttons">
                        ${card.buttons.map(btn => `
                            <a href="${btn.url}" target="_blank" class="button ${btn.type}-button">
                                <i class="fas ${btn.icon}"></i> ${btn.text}
                            </a>
                        `).join('')}
                    </div>
                `;
                break;

            case 'education':
                section.innerHTML = `
                    <h3><i class="fas ${card.icon}"></i> ${card.title}</h3><br>
                    <ul>
                        <li>大学: ${window.siteConfig.siteInfo.profile.education.university}</li>
                        <li>专业: ${window.siteConfig.siteInfo.profile.education.major}</li>
                        <li>年份: ${window.siteConfig.siteInfo.profile.education.year}</li>
                    </ul>
                `;
                break;

            case 'projects':
                section.innerHTML = `
                    <h3><i class="fas ${card.icon}"></i> ${card.title}</h3><br>
                    <ul class="project-list"></ul>
                `;
                renderProjects(window.siteConfig.projects);
                break;

            case 'contact':
                section.innerHTML = `
                    <h3><i class="fas ${card.icon}"></i> ${card.title}</h3><br>
                    <div class="contact-options">
                        <a href="${window.siteConfig.socialLinks.email}">
                            <i class="fas fa-at"></i>
                            <span>电子邮件</span><br>
                        </a>
                        <a href="${window.siteConfig.socialLinks.github}" target="_blank">
                            <i class="fab fa-github"></i>
                            <span>Github</span><br>
                        </a>
                        <a href="${window.siteConfig.socialLinks.bilibili}" target="_blank">
                            <i class="fab fa-bilibili"></i>
                            <span>Bilibili</span>
                        </a>
                    </div>
                `;
                break;

            case 'website-info':
                section.innerHTML = `
                    <h3><i class="fas ${card.icon}"></i> ${card.title}</h3><br>
                    <ul>
                        ${card.showVisits ? `
                            <li><strong>本站总访问量：</strong><span id="busuanzi_value_site_pv"></span> 次</li>
                            <li><strong>本站总访客数：</strong><span id="busuanzi_value_site_uv"></span> 人</li>
                        ` : ''}
                        ${card.showRuntime ? `
                            <li><div id="runtime-info-container"></div></li>
                        ` : ''}
                    </ul>
                `;
                // 立即初始化运行时间
                if (card.showRuntime && window.siteConfig && window.siteConfig.siteInfo && window.siteConfig.siteInfo.startDate) {
                    initRuntimeInfo(window.siteConfig);
                }
                break;

            case 'carousel':
                section.innerHTML = `
                    <h3><i class="fas ${card.icon}"></i> ${card.title}</h3><br><br>
                    <div class="carousel-card">
                        <button class="next-btn" onclick="nextSlide()">❯</button>
                        <button class="prev-btn" onclick="prevSlide()">❮</button>
                        <div class="carousel-container">
                            <img class="carousel-img">
                        </div>
                    </div>
                `;
                break;

            case 'music':
                section.innerHTML = `
                    <h3><i class="fas ${card.icon}"></i> ${card.title}</h3>
                    <br><br>
                    <div id="aplayer"></div>
                `;
                break;

            case 'comments':
                section.innerHTML = `
                    <h3><i class="fas ${card.icon}"></i> ${card.title}</h3><br>
                    <div id="twikoo"></div>
                `;
                break;

            default:
                if (card.title) {
                    section.innerHTML = `
                        <h3><i class="fas ${card.icon}"></i> ${card.title}</h3><br>
                        ${card.content ? `<p>${card.content}</p>` : ''}
                        ${card.items ? `
                            <ul>
                                ${card.items.map(item => `
                                    <li>${item.label}: ${item.value}</li>
                                `).join('')}
                            </ul>
                        ` : ''}
                    `;
                }
                break;
        }

        homepage.appendChild(section);
    });

    // 重新初始化需要的功能
    initCarousel(); // 确保在卡片渲染后初始化轮播图
    updateClock();
    initHitokoto();
    if (window.siteConfig.music && window.siteConfig.music.type === 'meting') {
        const musicContainer = document.querySelector('#aplayer');
        if (musicContainer) {
            const metingJs = document.createElement('meting-js');
            Object.entries(window.siteConfig.music.settings).forEach(([key, value]) => {
                metingJs.setAttribute(key, value);
            });
            musicContainer.appendChild(metingJs);
        }
    }
    if (window.siteConfig.comments && window.siteConfig.comments.system === 'twikoo') {
        twikoo.init(window.siteConfig.comments.settings);
    }
    if (window.siteConfig.projects) {
        renderProjects(window.siteConfig.projects);
    }
}

// DOM内容加载完成时的事件处理
document.addEventListener('DOMContentLoaded', function () {
    // 初始化基本功能
    setInitialDarkMode();
    updateClock();
    initBackgroundImage();
    initHitokoto();
    
    // 加载配置
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            initSiteWithConfig(config);
            // 在配置加载完成后再初始化轮播图
            if (config.carousel) {
                carouselImages = config.carousel.images;
                initCarousel();
                startAutoSlide();
            }
        })
        .catch(error => {
            console.error('Error loading config:', error);
        });
        
    hideLoading();
});

// 加载卡片内容
fetch('cards.json')
    .then(response => response.json())
    .then(data => {
        renderCards(data.cards);
    })
    .catch(error => {
        console.error('Error loading cards:', error);
    });

// 渲染卡片内容
function renderCards(cards) {
    const parentContainer = document.querySelector('.cardContainer');
    if (!parentContainer) {
        console.error('Card container not found');
        return;
    }

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('cardItem');
        cardElement.id = card.id;
        if (card.id === 'card1') {
            cardElement.classList.add('active');
        }

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');

        card.items.forEach(item => {
            const link = document.createElement('a');
            link.href = item.url;
            link.target = '_blank';
            link.classList.add('grid-item');
            link.setAttribute('data-url', item.url);

            const img = document.createElement('img');
            img.classList.add('icon');
            img.src = item.icon;
            img.alt = 'Website Icon';

            const span = document.createElement('span');
            span.textContent = item.name;

            link.appendChild(img);
            link.appendChild(span);
            gridContainer.appendChild(link);
        });

        cardElement.appendChild(gridContainer);
        parentContainer.appendChild(cardElement);
    });

    // 初始化卡片交互
    initializeCardInteractions();
}

// 初始化卡片交互
function initializeCardInteractions() {
    const cardItems = document.querySelectorAll('.cardItem');
    cardItems.forEach(card => {
        card.addEventListener('click', function() {
            const cardNumber = parseInt(this.id.replace('card', ''), 10);
            switchToCard(cardNumber);
        });
    });
}