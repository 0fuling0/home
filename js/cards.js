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
}