/******************** 公共函数和变量 ********************/

// 定义深色模式和浅色模式的主题颜色
const DARK_MODE_COLOR = '#272a29';
const LIGHT_MODE_COLOR = '#cfd2d1';

// 定义当前背景图片索引
let currentBackgroundImageIndex = 0;

// 定义背景图片数组
const backgroundImages = [
  'img/ComfyUI_00122_.png',
  'img/ComfyUI_00121_.png',
  'img/ComfyUI_00094_.png',
  'img/ComfyUI_00086_.png',
  'img/ComfyUI_00079_.png',
  'img/ComfyUI_00082_.png',
  'img/ComfyUI_00085_.png'
  // 更多图片路径
];

// 定义轮播图图片数组
const carouselImages = [
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/ComfyUI_00122_.webp",
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/ComfyUI_00121_.webp",
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/ComfyUI_00094_.webp",
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/ComfyUI_00086_.webp",
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/ComfyUI_00079_.webp",
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/ComfyUI_00082_.webp",
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/ComfyUI_00085_.webp"
];

// 定义轮播图当前索引
let currentCarouselIndex = 0;

// 定义自动轮播计时器
let autoSlideInterval;

/******************** 页面加载和初始化操作 ********************/

// 页面加载完成后执行的操作
window.addEventListener('load', function () {
  const loadTime = performance.now(); // 获取页面加载时间
  if (loadTime < 1000) {
    setTimeout(hideLoading, 500); // 延迟0.5秒隐藏加载页面
  } else {
    hideLoading(); // 正常隐藏加载页面
  }
  adjustFooter(); // 调整footer位置
});

// DOM内容加载完成后执行的操作
document.addEventListener('DOMContentLoaded', function () {
  showLoading(); // 显示加载页面
  setInitialDarkMode(); // 设置初始的深色模式
  updateClock(); // 初始化时钟
  updateRuntimeInfo(); // 更新网站运行时间信息
  initBackgroundImage(); // 初始化背景图片
  initCarousel(); // 初始化轮播图
  initHitokoto(); // 初始化一言
  startAutoSlide(); // 开始自动轮播背景图片
});

/******************** 加载页面显示与隐藏 ********************/

// 显示加载页面的函数
function showLoading() {
  document.querySelector('.loading-container').style.display = 'flex';
}

// 隐藏加载页面的函数
function hideLoading() {
  document.querySelector('.loading-container').style.display = 'none';
}


/******************** Footer位置调整 ********************/

// 调整footer位置的函数
function adjustFooter() {
  const footer = document.querySelector('footer');
  const header = document.querySelector('header');
  const mainContainer = document.querySelector('.container');

  // 获取各部分的高度
  const headerHeight = header.offsetHeight;
  const mainContainerHeight = mainContainer.offsetHeight;
  const footerHeight = footer.offsetHeight;

  // 计算内容总高度
  const totalHeight = headerHeight + mainContainerHeight + footerHeight + 10;
  const windowHeight = document.documentElement.clientHeight;

  // 根据窗口高度调整footer位置
  if (windowHeight < totalHeight) {
    footer.style.bottom = '-55px';
  } else {
    footer.style.bottom = '0';
  }
}

// 监听窗口大小变化，实时调整footer位置
window.addEventListener('resize', adjustFooter);

/******************** 背景图片切换 ********************/

// 初始化背景图片
function initBackgroundImage() {
  const body = document.body;

  // 从localStorage加载上次保存的背景图片索引
  const savedIndex = localStorage.getItem('backgroundImageIndex');
  if (savedIndex !== null) {
    currentBackgroundImageIndex = parseInt(savedIndex);
  }

  updateBackgroundImage(); // 更新背景图片

  // 监听过渡效果结束，移除过渡属性
  body.addEventListener('transitionend', function () {
    body.style.transition = '';
  });
}

// 更新背景图片的函数
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

// 开始自动切换背景图片
function startAutoSlide() {
  setInterval(nextBackgroundImage, 10000);
}

/******************** 轮播图功能 ********************/

// 初始化轮播图
function initCarousel() {
  showSlide(currentCarouselIndex); // 显示初始幻灯片

  // 开始自动轮播
  autoSlideInterval = setInterval(nextSlide, 10000);

  // 监听鼠标事件，暂停和恢复自动轮播
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.addEventListener('mouseenter', stopAutoSlide);
  carouselContainer.addEventListener('mouseleave', startAutoSlide);
}

// 显示指定索引的幻灯片
function showSlide(index) {
  const img = document.querySelector('.carousel-img');
  img.src = carouselImages[index];
}

// 显示下一张幻灯片
function nextSlide() {
  currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
  showSlide(currentCarouselIndex);
}

// 显示上一张幻灯片
function prevSlide() {
  currentCarouselIndex = (currentCarouselIndex - 1 + carouselImages.length) % carouselImages.length;
  showSlide(currentCarouselIndex);
}

// 停止自动轮播
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// 重新开始自动轮播
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 10000);
}

/******************** 深色模式切换 ********************/

// 切换深色模式
function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  updateThemeColor(isDarkMode);
  localStorage.setItem('darkMode', isDarkMode);
}

// 更新主题颜色的meta标签
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

// 监听系统主题模式变化，自动切换深色模式
window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
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

/******************** 时钟功能 ********************/

// 更新时钟的函数
function updateClock() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString('zh-CN', options);
  const timeString = now.toLocaleTimeString('zh-CN', { hour12: false });

  // 更新所有具有 "clock" 类名的元素
  document.querySelectorAll('.clock').forEach(clockElement => {
    clockElement.innerHTML = `
      <div class="clock-date">${dateString}</div>
      <div class="clock-time">${timeString}</div>
    `;
  });
}

// 每秒更新一次时钟
setInterval(updateClock, 1000);

/******************** 返回顶部和底部功能 ********************/

// 绑定返回顶部按钮点击事件
document.getElementById('backToTop').addEventListener('click', function () {
  scrollToPosition(0, 500); // 滚动到顶部，持续500毫秒
});

// 绑定返回底部按钮点击事件
document.getElementById('backToBottom').addEventListener('click', function () {
  const documentHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  const windowHeight = window.innerHeight;
  const targetPosition = documentHeight - windowHeight;
  scrollToPosition(targetPosition, 700); // 滚动到底部，持续700毫秒
});

// 平滑滚动到指定位置的函数
function scrollToPosition(target, duration) {
  const start = window.pageYOffset;
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

/******************** 一言（Hitokoto）获取 ********************/

// 初始化一言
function initHitokoto() {
  // 设置默认文本
  document.querySelectorAll('.hitokoto-container').forEach(container => {
    container.innerHTML = '你好，又见面了！';
  });

  getHitokoto(); // 初始加载一言

  // 每10秒重新请求一言
  setInterval(getHitokoto, 10000);
}

// 获取一言内容的函数
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
      // 加载失败时不进行额外处理
    });
}

/******************** 网站运行时间计算 ********************/

// 更新网站运行时间信息的函数
function updateRuntimeInfo() {
  const startDate = new Date('2024-03-04T00:00:00Z'); // 设置网站开始运行的日期
  const currentDate = new Date();

  const years = currentDate.getFullYear() - startDate.getFullYear();
  const months = (currentDate.getMonth() - startDate.getMonth() +
    12 * (currentDate.getFullYear() - startDate.getFullYear()));
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  // 获取运行时间信息容器
  const runtimeInfoContainer = document.getElementById('runtime-info-container');

  // 检查年和月是否为0，如果是，则隐藏它们
  const yearString = years > 0 ? `${years} 年` : '';
  const monthString = months > 0 ? `${months} 月` : '';
  const dayString = `${days} 天`;

  // 更新容器内容
  runtimeInfoContainer.innerHTML = `
    <strong>网站运行时间：</strong>
    ${yearString} ${monthString} ${dayString}
  `;
}

/******************** 卡片样式更新（如果需要） ********************/

/*
function updateCardStyle() {
  // 获取卡片容器
  const container = document.querySelector('.container');

  // 获取所有卡片
  const cards = container.querySelectorAll('.card');

  // 假设每行显示3个卡片
  const cardsPerRow = 3;

  // 计算最后一行的卡片数量
  const lastRowCards = cards.length % cardsPerRow;

  // 获取当前屏幕宽度
  const screenWidth = window.innerWidth;

  // 如果最后一行有2个卡片，且屏幕宽度满足条件，调整最后一个卡片样式
  if (lastRowCards === 2 && screenWidth >= 1025) {
    const lastCard = cards[cards.length - 1];
    lastCard.style.marginRight = 'calc(33.3333% + 5px)';
  } else {
    // 确保样式被清除
    const lastCard = cards[cards.length - 1];
    if (lastCard) {
      lastCard.style.marginRight = '';
    }
  }
}

// 初始化时调用一次
updateCardStyle();

// 监听窗口大小变化，实时更新卡片样式
window.addEventListener('resize', updateCardStyle);
*/

/******************** Twikoo评论区初始化 ********************/

twikoo.init({
  envId: 'https://twikoo.fuling.cloudns.org/', // 腾讯云环境填 envId；Vercel 环境填地址
  el: '#tcomment', // 容器元素
  // 其他可选配置项
});


function showSection(sectionId) {
    // 隐藏特定的 section
    const sectionsToHide = ['homepage', 'navpage'];
    sectionsToHide.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = 'none';
        }
    });

    // 显示指定的 section
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
        updateHeaderText(sectionId);
    } else {
        console.log(`Section with id ${sectionId} not found.`);
    }

    // 根据 sectionId 设置 main 的 column-count
    const mainElement = document.querySelector('main');
    mainElement.style.columnCount = (sectionId === 'navpage') ? '1' : ''; // 或者你想要的默认值

    // 调整 footer 位置
    adjustFooter();
}

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
            // Add more cases as needed for other sections
            default:
                headerTextElement.textContent = "Fuling's Homepage";
                break;
        }
    }
}



function init() {
    // 获取地址栏中的哈希
    const hash = window.location.hash.substring(1); // 去掉 #
    
    // 显示相应的 section
    if (hash === 'nav' || hash === 'home') {
        showSection(hash + 'page');
    } else {
        showSection('homepage'); // 默认显示 homepage
    }
}

// 初始化时检查地址栏哈希
init();

// 在地址栏哈希变化时重新检查
window.addEventListener('hashchange', init);

let timer;
let currentCardNumber;

function startTimer(cardNumber) {
    timer = setTimeout(() => showCard(cardNumber), 500);
}

function clearTimer() {
    clearTimeout(timer);
}

function showCard(cardNumber) {
    const cards = document.querySelectorAll('.cardItem');
    cards.forEach(card => card.classList.remove('active', 'current'));

    const selectedCard = document.getElementById(`card${cardNumber}`);
    selectedCard.classList.add('active', 'current');

    // 从旧的导航按钮移除 'current' 类
    const oldNavButton = document.querySelector(`.navButton[data-card="${currentCardNumber}"]`);
    if (oldNavButton) {
        oldNavButton.classList.remove('current');
    }

    // 将 'current' 类添加到新的导航按钮
    const newNavButton = document.querySelector(`.navButton[data-card="${cardNumber}"]`);
    if (newNavButton) {
        newNavButton.classList.add('current');
    }

    // 存储当前卡片编号
    currentCardNumber = cardNumber;
}

// 初始化：给第一个按钮添加 'current' 类
document.querySelector('.navButton[data-card="1"]').classList.add('current');
currentCardNumber = 1; // 设置初始的卡片编号

// 调用这个函数切换到特定的卡片
function switchToCard(newCardNumber) {
    clearTimer();
    showCard(newCardNumber);
}

// 添加点击事件处理程序，直接点击卡片时切换
const cardItems = document.querySelectorAll('.cardItem');
cardItems.forEach(card => {
    card.addEventListener('click', function () {
        const cardNumber = parseInt(this.id.replace('card', ''), 10);
        switchToCard(cardNumber);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(function (item) {
        item.addEventListener('click', function (event) {
            event.preventDefault(); // 阻止点击事件的默认行为
            event.stopPropagation(); // 阻止事件冒泡

            var url = item.getAttribute('data-url');
            window.open(url, '_blank');
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // 获取链接元素
    var linkElements = document.querySelectorAll('.grid-item');
    var totalLinks = linkElements.length;

    // 如果链接数不足24个，计算需要添加的占位符数量
    var placeholdersNeeded = Math.max(0, 24 - totalLinks);

    // 创建占位符
    for (var i = 0; i < placeholdersNeeded; i++) {
        var placeholder = document.createElement('div');

        // 设置占位符样式和尺寸
        placeholder.classList.add('grid-item', 'placeholder');
        placeholder.style.backgroundColor = 'transparent'; // 设置占位符颜色

        // 将占位符插入到卡片的 grid-container 中
        var cardContainer = document.querySelector('.cardItem.active .grid-container');
        cardContainer.appendChild(placeholder);
    }
});

function toggleOptions() {
    var options = document.getElementById('searchOptions');
    options.style.display = options.style.display === 'grid' ? 'none' : 'grid';
}

function selectOption(option) {
    document.querySelector('.select-styled').textContent = option;
    toggleOptions();
}

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
}
