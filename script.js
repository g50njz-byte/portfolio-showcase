/* ==========================================================================
   UVU SUPPLY CO. - インタラクション & カートシステム JavaScript
   ========================================================================== */

// 状態管理 (Cart State)
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initCategoryFilter();
    initCartDrawer();
});

// ヘッダースクロール効果
function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
        } else {
            header.style.padding = '16px 0';
        }
    });
}

// カテゴリーフィルター切り替え
function initCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // アクティブボタンの切り替え
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            // カードの表示・非表示
            productCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// カートドロワー制御
function initCartDrawer() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');

    cartBtn.addEventListener('click', () => {
        cartDrawer.classList.add('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
    });

    cartOverlay.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
    });
}

// カート追加関数 (グローバル)
function addToCart(name, price, size) {
    const existingIndex = cart.findIndex(item => item.name === name && item.size === size);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            size: size,
            quantity: 1
        });
    }

    updateCartUI();
    
    // カートドロワーを開く
    document.getElementById('cartDrawer').classList.add('active');
}

// カートUI更新
function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const cartDrawerCount = document.getElementById('cartDrawerCount');
    const cartBody = document.getElementById('cartBody');
    const cartTotalAmount = document.getElementById('cartTotalAmount');

    // 総数カウント
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartDrawerCount.textContent = totalItems;

    // 合計金額
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalAmount.textContent = `¥${totalPrice.toLocaleString()}`;

    // カートの中身レンダリング
    if (cart.length === 0) {
        cartBody.innerHTML = '<p class="empty-cart-msg">かごの中に商品はありません。</p>';
    } else {
        cartBody.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>サイズ: ${item.size} / 数量: ${item.quantity}</p>
                    <p style="font-weight:700; margin-top:4px;">¥${(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#888; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `).join('');
    }
}

// カートから削除
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}
