---
tags:
  - web/react
  - web/frontend
  - react/hooks
  - level/intermediate
created: 2026-08-29
updated: 2026-08-29
---

# ⚛️ React による状態管理とリアルタイムタイマー設計

> [!abstract] 📐 ポートフォリオ統括アーキテクトより
> Reactの真価は、**「状態（State）の変化に応じてUIが滑らかに連動するリアクティブな設計」**にあります。
> リアルタイムタイマーやカンバンボードは、ReactのHooks（`useState`, `useEffect`, `useRef`）を学ぶ最高の題材です。

---

## 🌟 タイマー実装の重要ポイント (`useRef`)

`setInterval` を扱う際、通常の変数ではなく `useRef` でタイマーIDを保持することで、**コンポーネントの再レンダリング時にもタイマー参照が失われず、メモリリークを防止**できます。

```javascript
const [seconds, setSeconds] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const timerRef = useRef(null);

const startTimer = () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
};
```

---

## 🔗 関連リンク
- 💼 実践制作: [[02_task_billing_saas/README|02. TaskFlow & Invoice SaaS]]
- 🎨 スタイリング: [[10_Concepts/TailwindCSSとモダンUI|Tailwind CSSとモダンUI]]
- 🗺️ [[00_ポートフォリオ総合マップ|ポートフォリオ総合マップ]]
