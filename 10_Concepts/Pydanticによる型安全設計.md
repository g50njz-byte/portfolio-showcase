---
tags:
  - python/pydantic
  - python/typing
  - level/intermediate
created: 2026-08-29
updated: 2026-08-29
---

# 📐 Pydantic による型安全データ設計

> [!abstract] ⚡ フルスタック＆AIエンジニアより
> **Pydantic** は、Pythonの型アノテーションを使ってデータのバリデーション（検証）やシリアライズ（JSON変換）を高速に行うライブラリです。FastAPIのデータ層の心臓部として機能します。

---

## 🛠️ 基本コード例

```python
from pydantic import BaseModel, Field

class UserProfile(BaseModel):
    user_id: int
    username: str = Field(..., min_length=3, max_length=20)
    score: float = Field(0.0, ge=0.0, le=100.0)
    is_active: bool = True

# 型の自動チェックと変換
user = UserProfile(user_id="123", username="suzuki", score=95.5)
print(user.user_id)  # int型の 123 に自動変換
```

---

## 🔗 関連リンク
- ⚡ Webフレームワーク: [[10_Concepts/FastAPI入門と非同期処理|FastAPI入門と非同期処理]]
- 💼 実践制作: [[01_Portfolio_Projects/01_ai_data_dashboard/README|01. AIデータ分析ダッシュボード]]
- 🗺️ [[00_Python学習マップ|Python学習マップ MOC]]
