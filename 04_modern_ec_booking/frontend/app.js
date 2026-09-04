// LUMEN EC & Booking Platform Logic
const API_BASE = window.location.origin;

let allProducts = [
    { id: 1, name: "AURA Ceramic Aroma Diffuser", category: "Wellness", price: 12800, stock: 4, image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80", image_icon: "wind", description: "美濃焼セラミックと超音波ミストが融合。天然精油の純度を損なわずに空間を包み込みます。", rating: 4.9, review_count: 128 },
    { id: 2, name: "Titanium Pour-Over Dripper", category: "Lifestyle", price: 8400, stock: 18, image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", image_icon: "coffee", description: "純度99.6%チタン削り出し。金属臭ゼロでコーヒー豆本来の芳醇な酸味と甘みを引き出します。", rating: 4.8, review_count: 94 },
    { id: 3, name: "Minimalist Italian Leather Folio", category: "Lifestyle", price: 16500, stock: 3, image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", image_icon: "book-open", description: "トスカーナ産フルベジタブルタンニンレザー使用。使い込むほどに深みのある艶が育つ一生モノ。", rating: 4.9, review_count: 67 },
    { id: 4, name: "Solid Brass Meditation Bell", category: "Wellness", price: 6200, stock: 24, image_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80", image_icon: "bell", description: "京都の伝統鋳造技術による真鍮削り出し。心身を整える澄んだ高周波と15秒以上の余韻。", rating: 4.7, review_count: 52 },
    { id: 5, name: "AURA Pro Studio Monitor Headphone", category: "Audio", price: 42000, stock: 2, image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", image_icon: "headphones", description: "50mmベリリウムドライバー搭載。プロエンジニア基準のフラットな解像度と極限の遮音性。", rating: 5.0, review_count: 142 },
    { id: 6, name: "Artisanal Soy Botanical Candle", category: "Wellness", price: 4800, stock: 20, image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80", image_icon: "flame", description: "信州産ソイワックス100%と野生種ラベンダー。煤が出にくく、就寝前のマインドフルネスに最適。", rating: 4.6, review_count: 81 }
];

let currentCategory = "All";
let currentSort = "default";
let cart = [];
let appliedCoupon = null;
let bookings = [
    { service_name: "プレミアム音響プライベート試聴会", booking_date: "2026-09-05", time_slot: "14:00 - 15:00" },
    { service_name: "ハンドドリップ抽出マスタークラス", booking_date: "2026-09-06", time_slot: "11:00 - 12:30" }
];
let selectedSlot = "14:00 - 15:00";

document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) window.lucide.createIcons();
    fetchProducts();
    fetchBookings();
    updateBookingSlots();
});

// タブ切り替え
function switchView(view) {
    const storeView = document.getElementById("store-view");
    const bookingView = document.getElementById("booking-view");
    const storeBtn = document.getElementById("tab-store-btn");
    const bookingBtn = document.getElementById("tab-booking-btn");

    if (view === "store") {
        storeView.classList.remove("hidden");
        bookingView.classList.add("hidden");
        storeBtn.className = "px-4 py-2 rounded-lg transition flex items-center space-x-1.5 bg-white text-sky-700 shadow-sm";
        bookingBtn.className = "px-4 py-2 rounded-lg transition flex items-center space-x-1.5 text-slate-600 hover:text-slate-900";
    } else {
        storeView.classList.add("hidden");
        bookingView.classList.remove("hidden");
        storeBtn.className = "px-4 py-2 rounded-lg transition flex items-center space-x-1.5 text-slate-600 hover:text-slate-900";
        bookingBtn.className = "px-4 py-2 rounded-lg transition flex items-center space-x-1.5 bg-white text-sky-700 shadow-sm";
    }
    if (window.lucide) window.lucide.createIcons();
}

// 商品一覧取得 (API)
async function fetchProducts() {
    try {
        let url = `${API_BASE}/api/products?category=${encodeURIComponent(currentCategory)}`;
        if (currentSort !== "default") url += `&sort=${currentSort}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "success" && data.data && data.data.length > 0) {
            allProducts = data.data;
            renderProducts();
        }
    } catch (e) {
        // API未起動時も初期データで完全表示
        renderProducts();
    }
}

// 商品レンダリング
function renderProducts() {
    const container = document.getElementById("products-grid");
    if (!container) return;

    let displayList = [...allProducts];
    if (currentCategory !== "All") {
        displayList = displayList.filter(p => p.category === currentCategory);
    }
    if (currentSort === "price_asc") {
        displayList.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price_desc") {
        displayList.sort((a, b) => b.price - a.price);
    }

    container.innerHTML = displayList.map(p => `
        <div class="bg-white rounded-3xl p-5 border border-slate-200/80 card-ec flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300 group">
            <div>
                <!-- 商品写真 (高解像度・シズル感) -->
                <div class="relative h-52 rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                    <img
                        src="${p.image_url}"
                        alt="${p.name}"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                    />
                    <div class="absolute top-3 left-3">
                        <span class="text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-slate-700 shadow-sm border border-slate-200/60">
                            ${p.category}
                        </span>
                    </div>
                    <div class="absolute top-3 right-3">
                        <span class="text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur shadow-sm ${p.stock <= 5 ? 'bg-red-500/90 text-white' : 'bg-emerald-600/90 text-white'}">
                            ${p.stock <= 5 ? `残り僅か ${p.stock}点` : '即日発送'}
                        </span>
                    </div>
                </div>

                <!-- 評価・レビュー数 -->
                <div class="flex items-center space-x-1.5 text-amber-500 text-xs mb-1.5">
                    <div class="flex">
                        <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
                    </div>
                    <span class="font-bold font-mono text-slate-800">${p.rating}</span>
                    <span class="text-[11px] text-slate-400">(${p.review_count || 48}件の評価)</span>
                </div>

                <h3 class="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors duration-200 leading-snug">${p.name}</h3>
                <p class="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">${p.description}</p>
            </div>

            <div class="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div>
                    <span class="text-[10px] text-slate-400 block font-medium">税込・送料無料</span>
                    <div class="font-extrabold text-slate-900 text-xl font-mono tracking-tight">
                        ¥${p.price.toLocaleString()}
                    </div>
                </div>
                <button
                    onclick="addToCart(${p.id})"
                    ${p.stock <= 0 ? 'disabled' : ''}
                    class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 active:scale-95 text-white font-semibold text-xs transition-all duration-200 flex items-center space-x-1.5 shadow-md shadow-slate-900/10 hover:shadow-sky-600/25 disabled:opacity-50"
                >
                    <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
                    <span>カートに追加</span>
                </button>
            </div>
        </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
}

// カテゴリ変更
function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll(".cat-btn").forEach(btn => {
        if (btn.innerText === cat) {
            btn.className = "cat-btn px-3 py-1.5 rounded-lg bg-sky-600 text-white font-semibold shadow-sm transition";
        } else {
            btn.className = "cat-btn px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition";
        }
    });
    renderProducts();
}

// ソート変更
function changeSort(val) {
    currentSort = val;
    renderProducts();
}

// カート追加
function addToCart(productId) {
    const prod = allProducts.find(p => p.id === productId);
    if (!prod) return;

    const existing = cart.find(i => i.product_id === productId);
    if (existing) {
        if (existing.quantity >= prod.stock) {
            alert(`「${prod.name}」の在庫は残り${prod.stock}点です。`);
            return;
        }
        existing.quantity += 1;
    } else {
        cart.push({
            product_id: prod.id,
            name: prod.name,
            price: prod.price,
            stock: prod.stock,
            image_icon: prod.image_icon,
            quantity: 1
        });
    }

    renderCart();
    toggleCart(true);
}

// カート数量変更
function updateCartQuantity(productId, delta) {
    const item = cart.find(i => i.product_id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.product_id !== productId);
    } else if (item.quantity > item.stock) {
        item.quantity = item.stock;
        alert(`在庫上限（残り${item.stock}点）に達しました`);
    }
    renderCart();
}

// カート開閉
function toggleCart(open) {
    const drawer = document.getElementById("cart-drawer");
    if (open) {
        drawer.classList.remove("hidden");
        renderCart();
    } else {
        drawer.classList.add("hidden");
    }
}

// カートレンダリング & 金額計算
function renderCart() {
    const totalCount = cart.reduce((s, i) => s + i.quantity, 0);
    const badge = document.getElementById("cart-badge");
    const countLabel = document.getElementById("cart-count-label");

    if (totalCount > 0) {
        badge.classList.remove("hidden");
        badge.innerText = totalCount;
    } else {
        badge.classList.add("hidden");
    }
    if (countLabel) countLabel.innerText = `(${totalCount}点)`;

    const list = document.getElementById("cart-items-list");
    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="text-center py-16 text-slate-400 space-y-2">
                <i data-lucide="shopping-cart" class="w-10 h-10 mx-auto text-slate-300"></i>
                <p class="text-xs">カートに商品が入っていません</p>
            </div>
        `;
    } else {
        list.innerHTML = cart.map(i => `
            <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <i data-lucide="${i.image_icon || 'package'}" class="w-5 h-5 text-sky-600"></i>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-slate-900">${i.name}</h4>
                        <div class="text-xs font-mono text-slate-600">¥${i.price.toLocaleString()}</div>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <button onclick="updateCartQuantity(${i.product_id}, -1)" class="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100">-</button>
                    <span class="text-xs font-mono font-bold w-4 text-center">${i.quantity}</span>
                    <button onclick="updateCartQuantity(${i.product_id}, 1)" class="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100">+</button>
                </div>
            </div>
        `).join("");
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.rate) discount = Math.floor(subtotal * appliedCoupon.rate);
        if (appliedCoupon.amount) discount = Math.min(subtotal, appliedCoupon.amount);
    }
    const tax = Math.floor(Math.max(0, subtotal - discount) * 0.10);
    const total = Math.max(0, subtotal - discount) + tax;

    document.getElementById("cart-subtotal").innerText = `¥${subtotal.toLocaleString()}`;
    const discountRow = document.getElementById("cart-discount-row");
    if (discount > 0) {
        discountRow.classList.remove("hidden");
        document.getElementById("cart-discount").innerText = `-¥${discount.toLocaleString()}`;
    } else {
        discountRow.classList.add("hidden");
    }
    document.getElementById("cart-tax").innerText = `¥${tax.toLocaleString()}`;
    document.getElementById("cart-total").innerText = `¥${total.toLocaleString()}`;
    document.getElementById("modal-total-display").innerText = `¥${total.toLocaleString()}`;

    if (window.lucide) window.lucide.createIcons();
}

// クーポン適用
function applyCoupon() {
    const input = document.getElementById("coupon-input");
    const msg = document.getElementById("coupon-message");
    const code = input.value.trim().toUpperCase();

    if (code === "SPECIAL10") {
        appliedCoupon = { code: "SPECIAL10", rate: 0.1, label: "10% OFF" };
        msg.innerHTML = `<p class="text-[11px] text-emerald-600 font-semibold">✓ クーポン適用中: 10% OFF</p>`;
    } else {
        appliedCoupon = null;
        msg.innerHTML = `<p class="text-[11px] text-red-500">無効なコードです (例: SPECIAL10)</p>`;
    }
    renderCart();
}

// Stripe 決済モーダル
function openCheckoutModal() {
    if (cart.length === 0) {
        alert("カートが空です");
        return;
    }
    toggleCart(false);
    document.getElementById("checkout-modal").classList.remove("hidden");
    document.getElementById("stripe-checkout-form").classList.remove("hidden");
    document.getElementById("checkout-complete-view").classList.add("hidden");
    if (window.lucide) window.lucide.createIcons();
}

function closeCheckoutModal() {
    document.getElementById("checkout-modal").classList.add("hidden");
}

// 決済実行
async function processCheckout(e) {
    e.preventDefault();
    const btn = document.getElementById("btn-submit-pay");
    const text = document.getElementById("btn-pay-text");
    btn.disabled = true;
    text.innerText = "🔒 Stripe 決済を処理中...";

    const custName = document.getElementById("cust-name").value.trim();
    const custEmail = document.getElementById("cust-email").value.trim();

    try {
        const resp = await fetch(`${API_BASE}/api/checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customer_name: custName,
                email: custEmail,
                items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
                coupon_code: appliedCoupon ? appliedCoupon.code : null
            })
        });
        
        let orderData;
        if (resp.ok) {
            orderData = await resp.json();
        } else {
            // ローカルシミュレーション
            const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
            const discount = appliedCoupon ? Math.floor(subtotal * (appliedCoupon.rate || 0)) : 0;
            const tax = Math.floor((subtotal - discount) * 0.1);
            orderData = {
                order_number: `ORD-20260829-${Math.floor(1000 + Math.random() * 9000)}`,
                customer_name: custName,
                total: subtotal - discount + tax
            };
        }

        setTimeout(() => {
            btn.disabled = false;
            text.innerText = "決済を完了する (Test)";
            document.getElementById("stripe-checkout-form").classList.add("hidden");
            const comp = document.getElementById("checkout-complete-view");
            comp.classList.remove("hidden");
            document.getElementById("complete-order-num").innerText = orderData.order_number;
            document.getElementById("complete-cust-name").innerText = orderData.customer_name;
            document.getElementById("complete-total").innerText = `¥${orderData.total.toLocaleString()}`;

            cart = [];
            appliedCoupon = null;
            renderCart();
            if (window.lucide) window.lucide.createIcons();
        }, 1000);
    } catch (err) {
        btn.disabled = false;
        text.innerText = "決済を完了する (Test)";
        alert("エラー: " + err.message);
    }
}

// 予約更新
async function fetchBookings() {
    try {
        const res = await fetch(`${API_BASE}/api/bookings`);
        const data = await res.json();
        if (data.status === "success" && data.data) {
            bookings = data.data;
            updateBookingSlots();
        }
    } catch (e) {
        updateBookingSlots();
    }
}

function updateBookingSlots() {
    const service = document.getElementById("booking-service").value;
    const date = document.getElementById("booking-date").value;
    const container = document.getElementById("slots-container");
    if (!container) return;

    const slots = ["11:00 - 12:00", "13:00 - 14:00", "14:00 - 15:00", "16:00 - 17:00"];
    
    container.innerHTML = slots.map(slot => {
        const booked = bookings.some(b => b.service_name === service && b.booking_date === date && b.time_slot === slot);
        const isSelected = selectedSlot === slot;
        return `
            <button
                type="button"
                ${booked ? 'disabled' : ''}
                onclick="selectSlot('${slot}')"
                class="p-3 rounded-xl border text-xs font-mono font-medium transition flex flex-col items-center justify-center space-y-1 ${
                    booked
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-600/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                }"
            >
                <span>${slot}</span>
                <span class="text-[10px]">${booked ? '満席 (Booked)' : '空き枠あり'}</span>
            </button>
        `;
    }).join("");

    document.getElementById("summary-service").innerText = service;
    document.getElementById("summary-datetime").innerText = `${date} (${selectedSlot})`;
}

function selectSlot(slot) {
    selectedSlot = slot;
    updateBookingSlots();
}

async function submitBooking(e) {
    e.preventDefault();
    const service = document.getElementById("booking-service").value;
    const date = document.getElementById("booking-date").value;
    const name = document.getElementById("booking-cust-name").value.trim();
    const email = document.getElementById("booking-cust-email").value.trim();

    try {
        const resp = await fetch(`${API_BASE}/api/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_name: service,
                booking_date: date,
                time_slot: selectedSlot,
                customer_name: name,
                email: email
            })
        });
        const data = await resp.json();
        const bookingId = data.booking_id || Math.floor(100 + Math.random() * 900);

        const alertBox = document.getElementById("booking-alert");
        const alertText = document.getElementById("booking-alert-text");
        alertBox.classList.remove("hidden");
        alertText.innerText = `ご予約が確定いたしました！（予約番号: #${bookingId}）`;
        bookings.push({ service_name: service, booking_date: date, time_slot: selectedSlot });
        updateBookingSlots();
        if (window.lucide) window.lucide.createIcons();
    } catch (err) {
        alert("予約エラー: " + err.message);
    }
}
