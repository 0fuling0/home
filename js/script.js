// 定义深色模式和浅色模式的颜色
const DARK_MODE_COLOR = '#272a29';
const LIGHT_MODE_COLOR = '#cfd2d1';

// 定义背景图片和轮播图片的索引
let currentBackgroundImageIndex = 0;
let currentCarouselIndex = 0;

// 定义背景图片和轮播图片的数组
const backgroundImages = [
    'img/0.jpg',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg'
];
const carouselImages = [
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
    adjustFooter();
});

// DOM内容加载完成时的事件处理
document.addEventListener('DOMContentLoaded', function () {
    setInitialDarkMode();
    updateClock();
    updateRuntimeInfo();
    initBackgroundImage();
    initCarousel();
    initHitokoto();
    startAutoSlide();
    backgroundImageInterval = setInterval(nextBackgroundImage, 10000);
	hideLoading();
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

// 调整页脚位置
function adjustFooter() {
    const footer = document.querySelector('footer');
    const header = document.querySelector('header');
    const mainContainer = document.querySelector('.container');
    const headerHeight = header.offsetHeight;
    const mainContainerHeight = mainContainer.offsetHeight;
    const footerHeight = footer.offsetHeight;
    const totalHeight = headerHeight + mainContainerHeight + footerHeight + 10;
    const windowHeight = document.documentElement.clientHeight;
    if (windowHeight < totalHeight) {
        footer.style.bottom = '-55px';
    } else {
        footer.style.bottom = '0';
    }
}
window.addEventListener('resize', adjustFooter);

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
    showSlide(currentCarouselIndex);
    startAutoSlide();
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
}

// 显示指定索引的轮播图
function showSlide(index) {
    const img = document.querySelector('.carousel-img');
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
        clockElement.innerHTML = `
      <div class="clock-date">${dateString}</div>
      <div class="clock-time">${timeString}</div>
    `;
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

// 初始化一言
function initHitokoto() {
    document.querySelectorAll('.hitokoto-container').forEach(container => {
        container.innerHTML = '你好，又见面了！';
    });
    getHitokoto();
    setInterval(getHitokoto, 10000);
}

// 获取一言
function getHitokoto() {
    fetch('https://v1.hitokoto.cn/')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll('.hitokoto-container').forEach(container => {
                container.innerText = data.hitokoto;
            });
        })
        .catch(error => {
            console.error('Error fetching hitokoto:', error);
        });
}

// 更新网站运行时间信息
function updateRuntimeInfo() {
    const startDate = new Date('2024-03-04T00:00:00Z'); // 更新为过去的开始日期
    const currentDate = new Date();

    let years = currentDate.getFullYear() - startDate.getFullYear();
    let months = currentDate.getMonth() - startDate.getMonth();
    let days = currentDate.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += previousMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const runtimeInfoContainer = document.getElementById('runtime-info-container');
    const yearString = years > 0 ? `${years} 年` : '';
    const monthString = months > 0 ? `${months} 月` : '';
    const dayString = `${days} 天`;

    runtimeInfoContainer.innerHTML = `
    <strong>网站运行时间：</strong>
    ${yearString} ${monthString} ${dayString}
  `;
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
    adjustFooter();
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