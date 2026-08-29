// AURA Creative Brand LP Logic
const API_BASE = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
    // Lucide Icons 初期化
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // マウス追従グローエフェクト
    window.addEventListener("mousemove", (e) => {
        document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    });

    // GSAP アニメーション（読み込まれている場合）
    if (typeof gsap !== "undefined") {
        gsap.from("#hero-tagline", { opacity: 0, y: -15, duration: 1, ease: "power3.out" });
        gsap.from("#hero-headline", { opacity: 0, y: 25, duration: 1.2, delay: 0.2, ease: "power3.out" });
        gsap.from("#hero-story", { opacity: 0, y: 15, duration: 1.2, delay: 0.4, ease: "power3.out" });
    }

    // Gemini AI コピーライター フォーム送信イベント
    const form = document.getElementById("ai-copy-form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const brandName = document.getElementById("input-brand-name").value.trim();
            const industry = document.getElementById("input-industry").value.trim();
            const keywords = document.getElementById("input-keywords").value.trim();
            const tone = document.getElementById("input-tone").value;

            const btnText = document.getElementById("btn-copy-text");
            const submitBtn = document.getElementById("btn-generate-copy");

            submitBtn.disabled = true;
            btnText.innerHTML = `<span class="animate-spin inline-block mr-2">⚙️</span> Gemini 2.0 がコピーを考案中...`;

            try {
                const resp = await fetch(`${API_BASE}/api/generate-copy`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        brand_name: brandName,
                        industry: industry,
                        keywords: keywords,
                        tone: tone
                    })
                });

                if (!resp.ok) throw new Error("API通信に失敗しました");
                const data = await resp.json();

                // Heroセクションを動的に更新
                const taglineEl = document.getElementById("hero-tagline");
                const headlineEl = document.getElementById("hero-headline");
                const storyEl = document.getElementById("hero-story");
                const phrasesEl = document.getElementById("hero-phrases");
                const badgeEl = document.getElementById("model-status-badge");

                if (taglineEl) taglineEl.innerText = data.tagline;
                if (headlineEl) headlineEl.innerText = data.headline;
                if (storyEl) storyEl.innerText = data.body_story;
                if (badgeEl) badgeEl.innerText = `Engine: ${data.model_used}`;

                if (phrasesEl && data.key_phrases) {
                    phrasesEl.innerHTML = data.key_phrases.map(p => `
                        <span class="px-3.5 py-1.5 rounded-lg bg-gold-50/80 border border-gold-200 text-xs font-medium text-gold-800">• ${p}</span>
                    `).join("");
                }

                // GSAP で滑らかに再フェード
                if (typeof gsap !== "undefined") {
                    gsap.fromTo("#hero-headline", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                    gsap.fromTo("#hero-story", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power2.out" });
                }

                // スムーズスクロールでHeroへ戻す
                window.scrollTo({ top: 0, behavior: "smooth" });

            } catch (err) {
                alert("生成エラー: " + err.message);
            } finally {
                submitBtn.disabled = false;
                btnText.innerHTML = `✨ LPのキャッチコピーをリアルタイム生成する`;
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }
});
