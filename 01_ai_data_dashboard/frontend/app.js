// AI Data Dashboard Frontend Logic
let trendChartInstance = null;
let featureChartInstance = null;

const API_BASE = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    fetchDashboardData();
    setupSimulator();

    document.getElementById("btn-refresh").addEventListener("click", () => {
        fetchDashboardData();
    });
});

async function fetchDashboardData() {
    try {
        const resp = await fetch(`${API_BASE}/api/dashboard`);
        if (!resp.ok) throw new Error("API通信に失敗しました");
        const data = await resp.json();

        renderKPIs(data.metrics);
        renderTrendChart(data.trends);
        renderFeatureChart(data.feature_importances);
        renderInsights(data.insights);
        lucide.createIcons();
    } catch (e) {
        console.error(e);
        alert("データの取得中にエラーが発生しました: " + e.message);
    }
}

function renderKPIs(metrics) {
    const container = document.getElementById("kpi-container");
    container.innerHTML = `
        <div class="glass-card glass-card-hover rounded-2xl p-5">
            <div class="flex items-center justify-between text-gray-400 text-xs mb-2">
                <span>総サンプル数</span>
                <div class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><i data-lucide="database" class="w-4 h-4"></i></div>
            </div>
            <div class="text-2xl font-extrabold text-white font-mono">${metrics.total_samples.toLocaleString()}</div>
            <div class="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
                <span>↑ +12.4%</span>
                <span class="text-gray-500">vs 前月</span>
            </div>
        </div>

        <div class="glass-card glass-card-hover rounded-2xl p-5">
            <div class="flex items-center justify-between text-gray-400 text-xs mb-2">
                <span>モデル予測精度 (Accuracy)</span>
                <div class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><i data-lucide="check-circle" class="w-4 h-4"></i></div>
            </div>
            <div class="text-2xl font-extrabold text-emerald-400 font-mono">${metrics.accuracy_score}%</div>
            <div class="text-xs text-gray-400 mt-1">F1 Score: <span class="font-mono text-white">${metrics.f1_score}%</span></div>
        </div>

        <div class="glass-card glass-card-hover rounded-2xl p-5">
            <div class="flex items-center justify-between text-gray-400 text-xs mb-2">
                <span>平均推論レイテンシ</span>
                <div class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><i data-lucide="zap" class="w-4 h-4"></i></div>
            </div>
            <div class="text-2xl font-extrabold text-white font-mono">${metrics.latency_ms} <span class="text-xs font-normal text-gray-400">ms</span></div>
            <div class="text-xs text-emerald-400 mt-1">超高速 (FastAPI async)</div>
        </div>

        <div class="glass-card glass-card-hover rounded-2xl p-5">
            <div class="flex items-center justify-between text-gray-400 text-xs mb-2">
                <span>追跡特徴量数</span>
                <div class="p-1.5 rounded-lg bg-violet-500/10 text-violet-400"><i data-lucide="layers" class="w-4 h-4"></i></div>
            </div>
            <div class="text-2xl font-extrabold text-white font-mono">${metrics.features_count} <span class="text-xs font-normal text-gray-400">次元</span></div>
            <div class="text-xs text-gray-400 mt-1">SHAP最適化済</div>
        </div>
    `;
}

function renderTrendChart(trends) {
    const ctx = document.getElementById("trendChart").getContext("2d");
    if (trendChartInstance) trendChartInstance.destroy();

    const labels = trends.map(t => t.timestamp);
    const actuals = trends.map(t => t.actual);
    const predicteds = trends.map(t => t.predicted);
    const uppers = trends.map(t => t.upper_bound);
    const lowers = trends.map(t => t.lower_bound);

    trendChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "実績値 (Actual)",
                    data: actuals,
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    borderWidth: 2,
                    pointBackgroundColor: "#10b981",
                    pointRadius: 4,
                    tension: 0.3
                },
                {
                    label: "AI予測値 (Forecast)",
                    data: predicteds,
                    borderColor: "#6366f1",
                    backgroundColor: "transparent",
                    borderWidth: 2.5,
                    borderDash: [5, 5],
                    pointRadius: 3,
                    tension: 0.3
                },
                {
                    label: "信頼区間 上限 (Upper)",
                    data: uppers,
                    borderColor: "rgba(99, 102, 241, 0.2)",
                    backgroundColor: "rgba(99, 102, 241, 0.08)",
                    fill: "+1",
                    borderWidth: 1,
                    pointRadius: 0
                },
                {
                    label: "信頼区間 下限 (Lower)",
                    data: lowers,
                    borderColor: "rgba(99, 102, 241, 0.2)",
                    backgroundColor: "transparent",
                    fill: false,
                    borderWidth: 1,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: "#94a3b8", font: { size: 11 } }
                }
            },
            scales: {
                x: {
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: { color: "#64748b", font: { size: 10 } }
                },
                y: {
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: { color: "#64748b", font: { size: 10 } }
                }
            }
        }
    });
}

function renderFeatureChart(features) {
    const ctx = document.getElementById("featureChart").getContext("2d");
    if (featureChartInstance) featureChartInstance.destroy();

    const labels = features.map(f => f.feature_name);
    const data = features.map(f => f.importance);

    featureChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "重要度スコア (%)",
                data: data,
                backgroundColor: [
                    "rgba(99, 102, 241, 0.8)",
                    "rgba(139, 92, 246, 0.8)",
                    "rgba(168, 85, 247, 0.8)",
                    "rgba(59, 130, 246, 0.8)",
                    "rgba(14, 165, 233, 0.8)",
                    "rgba(100, 116, 139, 0.6)"
                ],
                borderRadius: 6,
                borderWidth: 0
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                    ticks: { color: "#64748b", font: { size: 10 } }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: "#cbd5e1", font: { size: 11 } }
                }
            }
        }
    });
}

function renderInsights(insights) {
    const container = document.getElementById("insights-container");
    container.innerHTML = insights.map(item => {
        let badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
        let iconName = "info";
        if (item.type === "positive") {
            badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
            iconName = "check-circle";
        } else if (item.type === "warning") {
            badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/30";
            iconName = "alert-triangle";
        }

        return `
            <div class="p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition space-y-2">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-sm text-white flex items-center space-x-2">
                        <span>${item.title}</span>
                    </span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full border ${badgeColor} font-mono">
                        Impact: ${item.impact_score}/100
                    </span>
                </div>
                <p class="text-xs text-gray-300 leading-relaxed">${item.message}</p>
            </div>
        `;
    }).join("");
}

function setupSimulator() {
    const inputLr = document.getElementById("input-lr");
    const inputEpochs = document.getElementById("input-epochs");
    const inputNoise = document.getElementById("input-noise");

    inputLr.addEventListener("input", (e) => document.getElementById("val-lr").innerText = parseFloat(e.target.value).toFixed(3));
    inputEpochs.addEventListener("input", (e) => document.getElementById("val-epochs").innerText = e.target.value);
    inputNoise.addEventListener("input", (e) => document.getElementById("val-noise").innerText = parseFloat(e.target.value).toFixed(2));

    document.getElementById("sim-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = document.getElementById("btn-simulate");
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-spin inline-block mr-2">⚙️</span> 推論計算中...`;

        try {
            const resp = await fetch(`${API_BASE}/api/simulate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    learning_rate: parseFloat(inputLr.value),
                    epochs: parseInt(inputEpochs.value),
                    batch_size: 32,
                    noise_level: parseFloat(inputNoise.value),
                    target_metric: "revenue_growth"
                })
            });

            if (!resp.ok) throw new Error("シミュレーションAPIエラー");
            const result = await resp.json();

            const resDiv = document.getElementById("sim-result");
            resDiv.classList.remove("hidden");
            document.getElementById("res-acc").innerText = `${result.simulated_accuracy}%`;
            document.getElementById("res-roi").innerText = `+${result.estimated_roi}%`;

            document.getElementById("res-recs").innerHTML = result.recommendations.map(r => `• ${r}`).join("<br>");
        } catch (err) {
            alert("エラー: " + err.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i><span>シミュレーションを実行</span>`;
            lucide.createIcons();
        }
    });
}
