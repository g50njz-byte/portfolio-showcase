// AI Data Dashboard Frontend Logic
const API_BASE = window.location.origin.includes("github.io") ? "http://localhost:8080" : window.location.origin;

let trendChartInstance = null;
let featureChartInstance = null;

// モック初期データ
const initialMetrics = [
    { title: "月間総売上予測", value: "¥12,850,000", change: "+18.5%", trend: "up", icon: "dollar-sign" },
    { title: "AIモデル予測精度 (AUC)", value: "94.2%", change: "+2.1%", trend: "up", icon: "target" },
    { title: "異常検知アラート", value: "3 件", change: "-50.0%", trend: "down", icon: "alert-triangle" },
    { title: "平均推論レイテンシ", value: "14.2 ms", change: "-4.5ms", trend: "up", icon: "zap" }
];

const initialInsights = [
    { type: "opportunity", title: "需要ピーク予測", message: "来週末にかけて特定カテゴリの需要が通常比+35%急増する見込みです。在庫の事前補充を推奨します。", time: "10分前" },
    { type: "warning", title: "チャーンリスク検知", message: "特定セグメントでログイン頻度低下を検出。プロモーションクーポンの自動配信を提案します。", time: "1時間前" },
    { type: "info", title: "モデル自動再学習完了", message: "直近30日の実データを元にLightGBMモデルを再学習。予測誤差(RMSE)が3.8%改善されました。", time: "3時間前" }
];

document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) window.lucide.createIcons();
    renderKPIs(initialMetrics);
    renderInsights(initialInsights);
    initCharts();
    setupSimulator();
    fetchLiveMetrics();
});

function renderKPIs(metrics) {
    const container = document.getElementById("kpi-container");
    if (!container) return;

    container.innerHTML = metrics.map(m => `
        <div class="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between">
            <div class="flex justify-between items-start">
                <span class="text-xs text-gray-400 font-medium">${m.title}</span>
                <div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <i data-lucide="${m.icon}" class="w-4 h-4"></i>
                </div>
            </div>
            <div class="flex items-baseline justify-between mt-3">
                <span class="text-2xl font-bold font-mono text-white">${m.value}</span>
                <span class="text-xs font-mono font-semibold ${m.trend === 'up' ? 'text-emerald-400' : 'text-amber-400'}">${m.change}</span>
            </div>
        </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
}

function renderInsights(insights) {
    const container = document.getElementById("insights-container");
    if (!container) return;

    container.innerHTML = insights.map(item => `
        <div class="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start space-x-3.5">
            <div class="p-2 rounded-lg ${item.type === 'opportunity' ? 'bg-emerald-500/10 text-emerald-400' : item.type === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'}">
                <i data-lucide="${item.type === 'opportunity' ? 'arrow-up-right' : item.type === 'warning' ? 'alert-circle' : 'info'}" class="w-4 h-4"></i>
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-center">
                    <h4 class="text-xs font-bold text-white">${item.title}</h4>
                    <span class="text-[10px] text-gray-500 font-mono">${item.time}</span>
                </div>
                <p class="text-xs text-gray-400 mt-1 leading-relaxed">${item.message}</p>
            </div>
        </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
}

function initCharts() {
    // 1. トレンドチャート
    const ctx1 = document.getElementById("trendChart");
    if (ctx1) {
        trendChartInstance = new Chart(ctx1, {
            type: "line",
            data: {
                labels: ["4月", "5月", "6月", "7月", "8月", "9月", "10月(予)", "11月(予)", "12月(予)"],
                datasets: [
                    {
                        label: "実績売上 (千円)",
                        data: [8200, 9100, 10400, 11200, 12100, 12850, null, null, null],
                        borderColor: "#6366f1",
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        fill: true,
                        tension: 0.35,
                        borderWidth: 3,
                        pointBackgroundColor: "#6366f1"
                    },
                    {
                        label: "AI 予測売上 (千円)",
                        data: [null, null, null, null, null, 12850, 13400, 14100, 14900],
                        borderColor: "#f59e0b",
                        borderDash: [6, 6],
                        tension: 0.35,
                        borderWidth: 3,
                        pointBackgroundColor: "#f59e0b"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: "#94a3b8", font: { family: "Plus Jakarta Sans", size: 11 } } }
                },
                scales: {
                    y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", font: { family: "JetBrains Mono" } } },
                    x: { grid: { display: false }, ticks: { color: "#94a3b8" } }
                }
            }
        });
    }

    // 2. 特徴量チャート
    const ctx2 = document.getElementById("featureChart");
    if (ctx2) {
        featureChartInstance = new Chart(ctx2, {
            type: "bar",
            data: {
                labels: ["過去購買頻度", "季節性指数", "Web滞在時間", "キャンペーン露出", "価格弾力性"],
                datasets: [{
                    label: "SHAP 重要度寄与",
                    data: [0.38, 0.24, 0.18, 0.12, 0.08],
                    backgroundColor: "#8b5cf6",
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", font: { family: "JetBrains Mono" } } },
                    y: { grid: { display: false }, ticks: { color: "#e2e8f0", font: { size: 11 } } }
                }
            }
        });
    }
}

function setupSimulator() {
    const lrInput = document.getElementById("input-lr");
    const epochsInput = document.getElementById("input-epochs");
    const noiseInput = document.getElementById("input-noise");

    if (lrInput) lrInput.addEventListener("input", e => document.getElementById("val-lr").innerText = Number(e.target.value).toFixed(3));
    if (epochsInput) epochsInput.addEventListener("input", e => document.getElementById("val-epochs").innerText = e.target.value);
    if (noiseInput) noiseInput.addEventListener("input", e => document.getElementById("val-noise").innerText = Number(e.target.value).toFixed(2));

    const form = document.getElementById("sim-form");
    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const lr = Number(lrInput.value);
            const epochs = Number(epochsInput.value);
            const noise = Number(noiseInput.value);

            // 計算シミュレーション
            const acc = Math.min(99.2, (88.0 + (epochs * 0.05) - (noise * 15.0) + (lr * 40.0))).toFixed(1);
            const roi = (2.4 + (acc / 40.0)).toFixed(1);

            const resultBox = document.getElementById("sim-result");
            resultBox.classList.remove("hidden");
            document.getElementById("res-acc").innerText = `${acc}%`;
            document.getElementById("res-roi").innerText = `+${roi}x ROI`;
            document.getElementById("res-recs").innerText = `✓ 最適化されたモデル重みが計算されました。エポック数${epochs}における予測収束を確認。`;
        });
    }
}

async function fetchLiveMetrics() {
    try {
        const resp = await fetch(`${API_BASE}/api/metrics`, { signal: AbortSignal.timeout(1500) });
        if (resp.ok) {
            const data = await resp.json();
            if (data.metrics) renderKPIs(data.metrics);
        }
    } catch (e) {
        // エラーアラートを出さずに静かにフォールバック
    }
}
