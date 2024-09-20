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
  hideLoading(); // 隐藏加载页面
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
