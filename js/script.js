// script.js

document.addEventListener("DOMContentLoaded", function() {
    // 获取所有带有 class="remove-extension" 的链接
    var links = document.querySelectorAll(".remove-extension");

    links.forEach(function(link) {
        // 获取链接的 href 属性值
        var href = link.getAttribute("href");

        // 如果链接以 .html 结尾，移除 .html 后缀
        if (href.endsWith(".html")) {
            href = href.slice(0, -5); // 移除后缀的长度是 ".html" 的长度
        }

        // 更新链接的 href 属性
        link.setAttribute("href", href);
    });
});

// 显示加载页面
function showLoading() {
  document.querySelector('.loading-container').style.display = 'flex';
}

// 隐藏加载页面
function hideLoading() {
  document.querySelector('.loading-container').style.display = 'none';
}

// 初始时显示加载页面
showLoading();

// 监听页面加载完成事件
window.addEventListener('load', function () {
  // 页面加载完成后延迟两秒再隐藏加载页面
  setTimeout(function () {
    hideLoading();
    // 可以在这里添加其他需要执行的初始化操作
  }, 700); // 700毫秒即0.7秒
});

document.addEventListener('DOMContentLoaded', function () {
  // 背景图片数组
  const backgroundImages = [
    'img/00039-2738354015-flower%2C%20outdoors%2C%20day%2C%20bush%2Cnight%20sky%2C%20cloud%2C%20sunlight%2C%20(white%20flower_1.2)%2C%20_lora_add_detail_-3.5_%2Cpure%20color%20background%2Csimple.webp',
    'img/00040-1332967435-flower%2C%20outdoors%2C%20day%2C%20bush%2Cnight%20sky%2C%20cloud%2C%20sunlight%2C%20(white%20flower_1.2)%2C%20_lora_add_detail_-3.5_%2Cpure%20color%20background%2Csimple.webp',
    'img/00048-1332967445-flower%2C%20outdoors%2C%20day%2C%20bush%2Cnight%20sky%2C%20cloud%2C%20sunlight%2C%20(white%20flower_1.2)%2C%20_lora_add_detail_-3.5_%2Cpure%20color%20background%2Csimple.webp'
  ];

  let currentImageIndex = 0;
  const body = document.body;

  // 更新背景图片
  function updateBackgroundImage() {
    // 添加过渡效果，背景图片切换时平滑过渡
    body.style.transition = 'background-image 1.5s ease';
    // 设置当前背景图片
    body.style.backgroundImage = `url('${backgroundImages[currentImageIndex]}')`;
  }

  // 切换到下一张背景图片
  function nextBackgroundImage() {
    // 循环更新图片索引
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    // 预加载下一张图片
    preloadNextImage();
    // 更新背景图片
    updateBackgroundImage();
  }

  // 预加载下一张图片，并等待加载完成后再执行回调
  function preloadNextImage(callback) {
    const nextImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    const img = new Image();
    
    // 设置onload事件处理程序
    img.onload = function() {
      callback(); // 图片加载完成后执行回调
    };
    
    img.src = backgroundImages[nextImageIndex];
  }

  // 初始化背景，显示第一张图片
  updateBackgroundImage();

  // 每隔20秒切换背景图片
  setInterval(function() {
    // 预加载下一张图片，并在加载完成后切换
    preloadNextImage(nextBackgroundImage);
  }, 20000);

  // 过渡效果结束后移除过渡属性，防止影响后续背景切换
  body.addEventListener('transitionend', function () {
    body.style.transition = '';
  });
});


function updateCardStyle() {
  // 获取卡片容器
  const container = document.querySelector('.container');

  // 获取所有卡片
  const cards = container.querySelectorAll('.card');

  // 计算每行的卡片数量
  const cardsPerRow = 3; // 假设每行有3个卡片

  // 计算最后一行的卡片数量
  const lastRowCards = cards.length % cardsPerRow;

  // 获取当前屏幕宽度
  const screenWidth = window.innerWidth;

  // 如果是最后一行且卡片数量为2，并且屏幕宽度满足三栏布局的条件，为最后一个卡片添加样式
  if (lastRowCards === 2 && screenWidth >= 1025) {
    const lastCard = cards[cards.length - 1];
    lastCard.style.marginRight = 'calc(33.3333% + 5px)';
  } else {
    // 如果条件不满足，确保样式被清除
    const lastCard = cards[cards.length - 1];
    lastCard.style.marginRight = '';
  }
}

// 初始化时调用一次
updateCardStyle();

// 在窗口大小变化时实时更新样式
window.addEventListener('resize', updateCardStyle);




const DARK_MODE_COLOR = '#272a29';
const LIGHT_MODE_COLOR = '#cfd2d1';

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  updateThemeColor(isDarkMode);
  localStorage.setItem('darkMode', isDarkMode);
}

function updateThemeColor(isDarkMode) {
  const themeColorMeta = document.getElementById('theme-color-meta');
  themeColorMeta.content = isDarkMode ? DARK_MODE_COLOR : LIGHT_MODE_COLOR;
}

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

setInitialDarkMode();

// 监听系统主题模式变化
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




function updateClock() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString('zh-CN', options);
  const timeString = now.toLocaleTimeString('zh-CN', { hour12: false });

  const clockElement = document.getElementById('clock');
  clockElement.innerHTML = `<div id="date">${dateString}</div><div>${timeString}</div>`;
}

setInterval(updateClock, 1000);

updateClock(); // 初始化时钟

document.getElementById('backToTop').addEventListener('click', function () {
  scrollToTop(500); // 700毫秒，即0.7秒钟
});

document.getElementById('backToBottom').addEventListener('click', function () {
  scrollToBottom(700); // 700 毫秒为滚动的持续时间，你可以根据需要调整
});

function scrollToTop(duration) {
  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  scrollToAnimation(start, -start, duration, startTime);
}

function scrollToBottom(duration) {
  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  const windowHeight = window.innerHeight;

  const target = documentHeight - windowHeight;
  scrollToAnimation(start, target - start, duration, startTime);
}

function scrollToAnimation(start, distance, duration, startTime) {
  function scroll() {
    const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);

    if (timeElapsed < duration) {
      requestAnimationFrame(scroll);
    }
  }

  requestAnimationFrame(scroll);
}

function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
}

// 设置默认文本
document.getElementById('hitokotoContainer').innerHTML = '你好，又见面了！';

// 获取一言内容的函数
function getHitokoto() {
  // 请求一言 API
  fetch('https://v1.hitokoto.cn/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch hitokoto');
      }
      return response.json();
    })
    .then(data => {
      // 将一言内容插入到 #hitokotoContainer 元素中
      document.getElementById('hitokotoContainer').innerText = data.hitokoto;
    })
    .catch(error => {
      console.error('Error fetching hitokoto:', error);
      // 加载失败时不进行额外处理
    });
}

// 初始加载一言
getHitokoto();

// 每10秒重新请求一言
setInterval(getHitokoto, 10000);



// 获取footer元素
const footer = document.querySelector('footer');
const header = document.querySelector('header');
const mainContainer = document.querySelector('.container');

adjustFooter();

// 监听页面加载事件
window.addEventListener('load', adjustFooter);


// 监听窗口大小变化事件
window.addEventListener('resize', adjustFooter);



// 调整footer位置的函数
function adjustFooter() {
  // 获取header高度
  const headerHeight = header.offsetHeight;

  // 获取main.container的高度
  const mainContainerHeight = mainContainer.offsetHeight;

  // 获取footer的高度
  const footerHeight = footer.offsetHeight;

  // 计算页面内容的总高度，加上额外的 footer 高度和 10px
  const totalHeight = headerHeight + mainContainerHeight + footerHeight + 15;

  // 获取窗口可视区域高度
  const windowHeight = document.documentElement.clientHeight;

  // 如果窗口高度小于页面内容总高度，表示窗口不足以显示整个网页
  if (windowHeight < totalHeight) {
    // 将footer的bottom样式设置为'-35px'，使其位于页面底部
    footer.style.bottom = '-35px';
  } else {
    // 如果窗口高度不小于页面内容总高度，表示窗口足够显示整个网页
    // 将footer的bottom样式设置为'0'，使其位于页面底部
    footer.style.bottom = '0';
  }
}


let currentIndex = 0;
const images = [
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/00014-1978588402-flower%20sea%2C%20jewelry%2C%20flower%2C%20outdoors%2C%20day%2C%20rose%2C%20bush%2C%20sky%2C%20%20cloud%2C%20sunlight%2C%20white%20flower%2C%2Chuge%20flowers.webp",
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/00009-6666-%7B%7B%7Bmasterpiece%7D%7D%7D%2C%20%7B%7B%7Bbest%20quality%7D%7D%7D%2C%20elf%2C%20%7Blong%20pointy%20ears%7D%2C%20%7B%7B%7B%7B%7Bcolored%20skin%7D%7D%7D%7D%7D%2C%20%7B%7B%7B%7B%7B%7B%7Bgreen%20skin%7D%7D%7D%7D%7D%7D%7D%2C%20%7B%7B%7B%7Bgradient%20h.webp",
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/00021-4233344997-1girl%2C%20jewelry%2C%20flower%2C%20solo%2C%20black%20hair%2C%20necklace%2C%20long%20hair%2C%20outdoors%2C%20day%2C%20rose%2C%20bush%2C%20sky%2C%20upper%20body%2C%20cloud%2C%20lips%2C%20sunlight.webp",  
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/00034-4233345000-1girl%2C%20jewelry%2C%20flower%2C%20solo%2C%20black%20hair%2C%20necklace%2C%20long%20hair%2C%20outdoors%2C%20day%2C%20rose%2C%20bush%2C%20sky%2C%20upper%20body%2C%20cloud%2C%20lips%2C%20sunlight.webp",
  "https://cdn.jsdelivr.net/gh/0fuling0/mysource@main/img/00019-3904537912-flower%20sea%2C%20jewelry%2C%20flower%2C%20outdoors%2C%20day%2C%20rose%2C%20bush%2C%20sky%2C%20%20cloud%2C%20sunlight%2C%20white%20flower%2Chuge%20flowers%2C.webp"
];

function showSlide(index) {
  const img = document.querySelector('.carousel-img');
  img.src = images[index];
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showSlide(currentIndex);
}

// 自动切换图片定时器
let autoSlideInterval = setInterval(nextSlide, 10000);

// 停止自动切换图片的函数
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// 开始自动切换图片的函数
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 10000);
}

// 页面加载完毕后开始自动切换图片
document.addEventListener("DOMContentLoaded", startAutoSlide);

twikoo.init({
  envId: 'https://twikoo.fuling.cloudns.org/', // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
  el: '#tcomment', // 容器元素
  // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
  // path: location.pathname, // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数
  // lang: 'zh-CN', // 用于手动设定评论区语言，支持的语言列表 https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
})

// runtime.js
const startDate = new Date('2024-03-04T00:00:00Z');
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







