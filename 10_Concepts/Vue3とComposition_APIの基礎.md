---
tags:
  - web/vue
  - web/frontend
  - vue/composition-api
  - level/intermediate
created: 2026-08-29
updated: 2026-08-29
---

# 🟢 Vue.js 3 と Composition API の基礎

> [!abstract] 🎨 UI/UX＆Tailwindスペシャリストより
> **Vue.js 3** は、直感的で読みやすい記法と強力なリアクティビティ（反応性）システムを備えたフロントエンドフレームワークです。
> **Composition API**（`setup()`, `ref()`, `reactive()`）により、ロジックの再利用性とコードの構造化が飛躍的に向上しました。

---

## 🌟 Composition API のコア概念

1. **`ref(primitive)`**: 数値・文字列・真偽値などの単一の値をリアクティブにする。
2. **`reactive(object)`**: オブジェクト全体をまとめてリアクティブにする。
3. **`onMounted(fn)`**: DOMが生成された直後に実行されるライフサイクルフック（GSAP等のアニメーション初期化に最適）。

```javascript
import { ref, reactive, onMounted } from 'vue';

export default {
    setup() {
        const count = ref(0);
        const user = reactive({ name: 'Suzuki', role: 'Engineer' });

        const increment = () => count.value++;

        onMounted(() => {
            console.log('Component mounted!');
        });

        return { count, user, increment };
    }
};
```

---

## 🔗 関連リンク
- 💼 実践制作: [[03_creative_brand_lp/README|03. AURA - Creative Brand LP]]
- 🎬 モーション: [[10_Concepts/GSAPによるスクロール連動アニメーション|GSAPによるスクロール連動アニメーション]]
- 🗺️ [[00_ポートフォリオ総合マップ|ポートフォリオ総合マップ]]
