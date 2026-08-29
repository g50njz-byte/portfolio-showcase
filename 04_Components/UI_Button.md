# UI Component: Button (共通ボタン規約)

本ドキュメントは、AI組織が制作するWebサイトで共通して使用するボタンコンポーネントの仕様および実装コードである。
デザイナーおよび開発者は、ボタンの実装にあたって本規約に従わなければならない。

---

## 1. デザイン仕様

- **パディング**: 上下 0.75rem (12px), 左右 1.5rem (24px)
- **角丸**: `border-radius: 0.375rem` (6px) / Tailwind: `rounded-md`
- **フォント**: `font-weight: 600` (SemiBold), `font-size: 0.875rem` (14px)
- **トランジション**: `transition: all 0.2s ease-in-out`

---

## 2. バリエーションとコード

### Primary Button (主要アクション)
```html
<!-- HTML Structure -->
<button class="btn btn-primary" type="button">
  お問い合わせはこちら
</button>
```

```css
/* CSS Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--primary, #3b82f6);
  color: #ffffff;
}

.btn-primary:hover {
  background-color: var(--primary-hover, #2563eb);
  transform: translateY(-1px);
}

.btn-primary:focus {
  outline: 2px solid var(--primary, #3b82f6);
  outline-offset: 2px;
}
```

---

## 3. アクセシビリティ (a11y)
- フォームの送信に使用する場合は必ず `type="submit"` を指定すること。
- 装飾的なアイコンを含める場合は、スクリーンリーダーが余剰な情報を読み上げないようにアイコン要素に `aria-hidden="true"` を設定すること。
