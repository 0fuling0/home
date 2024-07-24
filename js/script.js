/* function updateCardStyle() {
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

 */

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

