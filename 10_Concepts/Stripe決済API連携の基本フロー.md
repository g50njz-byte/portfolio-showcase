---
tags:
  - payment/stripe
  - api/rest
  - security/fintech
  - level/advanced
created: 2026-08-29
updated: 2026-08-29
---

# 💳 Stripe 決済 API 連携の基本フロー

> [!abstract] ⚡ フルスタック＆AIエンジニアより
> **Stripe** は、グローバルスタンダードのオンライン決済インフラです。クレジットカード情報を自社サーバーで直接保持せず、Stripe Elements やトークンを用いて安全に決済を完了させます。

---

## 🌟 実務決済の標準 3 ステップ

1. **クライアント側でカード情報トークン化**: カード番号をStripeサーバーへ直接送信し、安全な `PaymentMethod` ID を取得。
2. **バックエンドで PaymentIntent 作成**: 金額・通貨を指定してStripe API を呼び出し。
3. **Webhook による決済確定通知**: 決済完了イベントを受け取り、注文ステータスを `paid` に更新。

---

## 🔗 関連リンク
- 💼 実践制作: [[04_modern_ec_booking/README|04. LUMEN - E-Commerce & Booking]]
- 🛍️ カート設計: [[10_Concepts/ECカートと在庫管理のトランザクション設計|ECカートと在庫管理のトランザクション設計]]
- 🗺️ [[00_ポートフォリオ総合マップ|ポートフォリオ総合マップ]]
