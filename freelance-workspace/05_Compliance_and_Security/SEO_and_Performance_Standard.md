# SEO・パフォーマンス品質標準 (SEO & Performance Standard)

本ドキュメントは、納品するWebサイトの検索表示・表示スピード・品質を高めるための標準技術仕様です。

---

## 1. 内部SEO・セマンティックHTML標準

1. **見出し構造 (Heading Hierarchy)**:
   - 1ページの中に `<h1>` は原則1つとし、`<h1>` ➔ `<h2>` ➔ `<h3>` の正しい階層構造を守ること。
2. **Metaタグ・OGP**:
   - `<title>` (30文字以内)、`<meta name="description">` (120文字以内) を全ページ個別に設定すること。
   - SNSシェア時のアイキャッチ用に OGP (`og:image`, `og:title`) を設定すること。

---

## 2. 表示速度・Core Web Vitals 最適化

1. **画像軽量化**:
   - 画像形式は WebP または圧縮済み JPEG/PNG を使用し、すべての `<img>` に `loading="lazy"` および `width` / `height` を指定すること。
2. **Lighthouseスコア指標**:
   - Google Lighthouse の Performance スコア 80点以上、SEO スコア 90点以上を標準納品基準とすること。
