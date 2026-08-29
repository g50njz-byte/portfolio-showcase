# 💻 03_Frontend_Code.md (和モダン×モノクロストリートWebサイト実装コード)

本ドキュメントには、`UVU SUPPLY CO.` の更新版Webサイト（シンプル × 和風タイポグラフィ × モノクロハイコントラスト・ストリートスタイル）の実装コードを記録しています。

実用ファイルパス:
- [index.html](file:///Users/kazuhirosuzuki/Desktop/テストフォルダ/index.html)
- [style.css](file:///Users/kazuhirosuzuki/Desktop/テストフォルダ/style.css)
- [script.js](file:///Users/kazuhirosuzuki/Desktop/テストフォルダ/script.js)

---

## 🎨 デザインコンセプト
1. **配色 (Color Palette)**:
   - メイン: 漆黒 (`#000000`) × 純白 (`#FFFFFF`) のハイコントラスト・モノクローム
   - ベース: 和紙風オフホワイト (`#F7F7F4`)
2. **フォント・タイポグラフィ (Typography)**:
   - 明朝体: `Shippori Mincho` (しっぽり明朝 - 和風の静寂と品格)
   - 重厚ゴシック: `Dela Gothic One` (太くエッジのあるストリート感)
   - 英文: `Syne` / `Montserrat`
3. **ストリート感・和モダンのアクセント**:
   - 縦書きタイポグラフィ（`writing-mode: vertical-rl`）「漆黒と静寂」「東京 渋谷 / NY」「極」
   - バックグラウンド透かし文字「東京」「STREET SYNDICATE」
   - 無限流動ティッカー（Marquee animation）
   - 太枠（`2px solid #000`）による無骨（Brutalist）なフレーム構成
