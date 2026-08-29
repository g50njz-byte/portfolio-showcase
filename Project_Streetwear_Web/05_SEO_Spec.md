# 05_SEO_Spec: UVU SUPPLY CO.

本ドキュメントは、「UVU SUPPLY CO.」公式ストアのSEOおよびメタタグの設定仕様を定義する。

## 1. 基本メタタグ
- **タイトル**: `<title>UVU SUPPLY CO. | Official Store</title>`
- **ディスクリプション**: 
  ```html
  <meta name="description" content="ストリートアパレルブランド「UVU SUPPLY CO.」の公式オンラインストア。NYの洗練された無機質さと、東京・渋谷・裏原宿のストリート/HIP HOPカルチャーを融合させたアパレルを展開。">
  ```
- **キーワード (非推奨だが補助用)**: `UVU, UVU SUPPLY, ストリートファッション, HIP HOP, 裏原宿, 渋谷, ニューヨーク`

## 2. OGP (Open Graph Protocol) 設定
SNSシェア時の表示を最適化するため、以下のOGPタグを設定する。
- **og:title**: `UVU SUPPLY CO. | Official Store`
- **og:description**: `From 212 to 03: The Underground Syndicate. NY × Tokyoのストリートカルチャーを融合させたハイエンドアパレル。`
- **og:type**: `website`
- **og:url**: `https://uvu-supply-co.example.com/` (ダミー)
- **og:image**: `https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1200&q=80` (ストリートアート・グラフィティ風のUnsplashの高品質画像)

## 3. セマンティックHTML構造
検索エンジンがサイト構造を正確にインデックスできるようにする。
- `<h1>`: Heroセクションのメインキャッチコピー「From 212 to 03: The Underground Syndicate.」
- `<h2>`: 各セクションの見出し（NEW ARRIVALS, LOOKBOOK, ABOUT など）
- 構造タグの利用: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>` を適切に使用する。
- 全ての画像（`<img>`）に `alt` 属性を付与する。
