// common.js

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
    'img/ComfyUI_00122_.png',
    'img/ComfyUI_00121_.png',
    'img/ComfyUI_00094_.png',
    'img/ComfyUI_00086_.png',
    'img/ComfyUI_00079_.png',
    'img/ComfyUI_00082_.png',
    'img/ComfyUI_00085_.png'

    // 更多图片路径
  ];

  let currentImageIndex = 0;
  const body = document.body;

  // 从localStorage加载上次保存的背景图片索引
  const savedImageIndex = localStorage.getItem('backgroundImageIndex');
  if (savedImageIndex !== null) {
    currentImageIndex = parseInt(savedImageIndex);
  }

  // 更新背景图片
  function updateBackgroundImage() {
    // 添加过渡效果，背景图片切换时平滑过渡
    body.style.transition = 'background-image 1.5s ease';
    // 设置当前背景图片
    body.style.backgroundImage = `url('${backgroundImages[currentImageIndex]}')`;
    // 保存当前背景图片索引到localStorage
    localStorage.setItem('backgroundImageIndex', currentImageIndex);
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
      if (callback) {
        callback(); // 图片加载完成后执行回调
      }
    };

    img.src = backgroundImages[nextImageIndex];
  }

  // 初始化背景，显示第一张图片
  updateBackgroundImage();

  // 每隔10秒切换背景图片
  setInterval(function() {
    // 预加载下一张图片，并在加载完成后切换
    preloadNextImage(nextBackgroundImage);
  }, 10000);

  // 过渡效果结束后移除过渡属性，防止影响后续背景切换
  body.addEventListener('transitionend', function () {
    body.style.transition = '';
  });
});






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
  const totalHeight = headerHeight + mainContainerHeight + footerHeight + 10;

  // 获取窗口可视区域高度
  const windowHeight = document.documentElement.clientHeight;

  // 如果窗口高度小于页面内容总高度，表示窗口不足以显示整个网页
  if (windowHeight < totalHeight) {
    // 将footer的bottom样式设置为'-35px'，使其位于页面底部
    footer.style.bottom = '-55px';
  } else {
    // 如果窗口高度不小于页面内容总高度，表示窗口足够显示整个网页
    // 将footer的bottom样式设置为'0'，使其位于页面底部
    footer.style.bottom = '0';
  }
}








