---
tags:
  - python/web
  - python/flask
  - api/rest
  - level/intermediate
created: 2026-08-29
updated: 2026-08-29
---

# 🌶️ Flask と REST API の基礎設計

> [!abstract] ⚡ フルスタック＆AIエンジニアより
> **Flask** は、最小限の構造で柔軟にWeb APIを構築できるPythonの軽量フレームワークです。
> マイクロサービスや小規模SaaS、プロトタイプ開発において世界中で圧倒的な採用実績を持ちます。

---

## 🌟 REST API 設計の4大原則 (CRUD)

1. **GET (取得)**: データの読み込み (`/api/tasks`)
2. **POST (作成)**: 新規データの追加 (`/api/tasks` + JSON)
3. **PATCH / PUT (更新)**: 既存データの一部/全体更新 (`/api/tasks/1`)
4. **DELETE (削除)**: データの破棄 (`/api/tasks/1`)

---

## 🛠️ 基本コード例

```python
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # React等のSPAからのクロスオリジン通信を許可

@app.route("/api/tasks", methods=["GET", "POST"])
def tasks():
    if request.method == "GET":
        return jsonify({"status": "success", "data": [{"id": 1, "title": "API設計"}]})
    elif request.method == "POST":
        data = request.json
        return jsonify({"status": "success", "created": data}), 201
```

---

## 🔗 関連リンク
- 💼 実践制作: [[02_task_billing_saas/README|02. TaskFlow & Invoice SaaS]]
- 📐 DB連携: [[10_Concepts/SQLiteによるデータモデリング|SQLiteによるデータモデリング]]
- 🗺️ [[00_ポートフォリオ総合マップ|ポートフォリオ総合マップ]]
