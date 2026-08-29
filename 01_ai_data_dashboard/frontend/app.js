// AI Data Dashboard Frontend Logic (with Smart Live Demo Fallback)
const API_BASE = window.location.origin.includes("github.io") ? "http://localhost:8080" : window.location.origin;

let revenueChart = null;

const mockSummary = {
    total_sales: 12850000,
    growth_rate: 18.5,
    avg_order_value: 42800,
    predicted_next_month: 14500000
};

const mockChartData = {
    months: ["4月", "5月", "6月", "7月", "8月", "9月", "10月(予)", "11月(予)", "12月(予)"],
    actual: [8200, 9100, 10400, 11200, 12100, 12850, null, null, null],
    predicted: [null, null, null, null, null, 12850, 13400, 14100, 14900]
};

document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) window.lucide.createIcons();
    initDashboard();
});

async function initDashboard() {
    try {
        const resp = await fetch(`${API_BASE}/api/summary`, { signal: AbortSignal.timeout(2000) });
        if (!resp.ok) throw new Error("API not available");
        const data = await resp.json();
        renderSummary(data);
    } catch (e) {
        // GitHub Pages デモモード
        renderSummary(mockSummary);
    }
    renderChart(mockChartData);
}

function renderSummary(data) {
    document.getElementById("total-sales").innerText = `¥${(data.total_sales || 12850000).toLocaleString()}`;
    document.getElementById("growth-rate").innerText = `+${data.growth_rate || 18.5}%`;
    document.getElementById("avg-order").innerText = `¥${(data.avg_order_value || 42800).toLocaleString()}`;
    document.getElementById("predicted-sales").innerText = `¥${(data.predicted_next_month || 14500000).toLocaleString()}`;
    if (window.lucide) window.lucide.createIcons();
}

function renderChart(data) {
    const ctx = document.getElementById("revenueChart");
    if (!ctx) return;
    if (revenueChart) revenueChart.destroy();

    revenueChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: data.months,
            datasets: [
                {
                    label: "実績売上 (千円)",
                    data: data.actual,
                    borderColor: "#0284c7",
                    backgroundColor: "rgba(2, 132, 199, 0.1)",
                    fill: true,
                    tension: 0.35,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: "#0284c7"
                },
                {
                    label: "AI 予測売上 (千円)",
                    data: data.predicted,
                    borderColor: "#f59e0b",
                    borderDash: [6, 6],
                    tension: 0.35,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: "#f59e0b"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top", labels: { font: { family: "Plus Jakarta Sans", size: 12 } } }
            },
            scales: {
                y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { family: "JetBrains Mono" } } },
                x: { grid: { display: false }, ticks: { font: { family: "Plus Jakarta Sans" } } }
            }
        }
    });
}

// シミュレータ更新
function updateSimulation() {
    const budget = Number(document.getElementById("sim-budget").value) || 50;
    const discount = Number(document.getElementById("sim-discount").value) || 5;
    
    document.getElementById("val-budget").innerText = `¥${budget}万`;
    document.getElementById("val-discount").innerText = `${discount}%`;

    const basePredicted = 14500000;
    const simulated = Math.floor(basePredicted + (budget * 45000) - (discount * 120000));
    document.getElementById("predicted-sales").innerText = `¥${simulated.toLocaleString()}`;

    const newPredicted = [null, null, null, null, null, 12850, Math.floor(13400 + budget * 5), Math.floor(14100 + budget * 8), Math.floor(simulated / 1000)];
    mockChartData.predicted = newPredicted;
    renderChart(mockChartData);
}
