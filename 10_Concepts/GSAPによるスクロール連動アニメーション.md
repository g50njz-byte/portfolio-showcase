---
tags:
  - web/animation
  - web/gsap
  - web/frontend
  - level/advanced
created: 2026-08-29
updated: 2026-08-29
---

# 🎬 GSAP によるスクロール連動アニメーション (ScrollTrigger)

> [!abstract] 🎨 UI/UX＆Tailwindスペシャリストより
> **GSAP (GreenSock Animation Platform)** は、Web業界標準の超高性能JavaScriptアニメーションライブラリです。
> **ScrollTrigger** プラグインと組み合わせることで、スクロール位置に応じた要素のフェードイン、パララックス、回転などを極めて滑らかに実現します。

---

## 🌟 基本実装パターン

```javascript
gsap.registerPlugin(ScrollTrigger);

// スクロールで要素が85%の位置に来たらふわりと浮遊フェードイン
gsap.from(".reveal-card", {
    scrollTrigger: {
        trigger: ".reveal-card",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: "power3.out"
});
```

---

## 🔗 関連リンク
- 💼 実践制作: [[03_creative_brand_lp/README|03. AURA - Creative Brand LP]]
- 🟢 フロントエンド: [[10_Concepts/Vue3とComposition_APIの基礎|Vue.js 3とComposition APIの基礎]]
- 🗺️ [[00_ポートフォリオ総合マップ|ポートフォリオ総合マップ]]
