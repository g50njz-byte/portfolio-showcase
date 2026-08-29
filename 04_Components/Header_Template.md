# UI Component: Header Template (共通ヘッダー規約)

本ドキュメントは、Webサイトのグローバルナビゲーションとして使用するヘッダーコンポーネントの共通仕様およびマークアップである。

---

## 1. デザイン仕様

- **レイアウト**: フレックスボックスによる左右分散配置（左側：ロゴ/サイト名、右側：メニューナビゲーション）
- **レスポンシブ動作**: 
  - スマホビュー（`< 768px`）: ハンバーガーメニュー、または簡略化したナビゲーション。
  - PCビュー（`>= 768px`）: インライン展開されたナビゲーションメニュー。
- **背景**: 半透明のぼかし（Glassmorphism）効果を推奨。
  ```css
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  ```

---

## 2. 標準コード

### HTML構造
```html
<header class="global-header">
  <div class="header-container">
    <a href="/" class="header-logo">
      <span>Sunnyside Cafe</span>
    </a>
    <nav class="header-nav" aria-label="メインナビゲーション">
      <ul class="nav-list">
        <li><a href="#menu" class="nav-link">Menu</a></li>
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="/contact" class="btn btn-primary nav-cta">Book Table</a></li>
      </ul>
    </nav>
  </div>
</header>
```

### CSSスタイリング
```css
.global-header {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: var(--header-bg, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
}

.header-logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary, #1e293b);
  text-decoration: none;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary, #3b82f6);
}

/* スマホ表示での簡易レスポンシブ */
@media (max-width: 768px) {
  .nav-list {
    gap: 1rem;
  }
  .nav-link {
    font-size: 0.8125rem;
  }
  .nav-cta {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
}
```
