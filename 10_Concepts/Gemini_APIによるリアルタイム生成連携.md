---
tags:
  - ai/gemini
  - api/llm
  - python/fastapi
  - level/advanced
created: 2026-08-29
updated: 2026-08-29
---

# 🧠 Gemini API によるリアルタイム生成連携

> [!abstract] ⚡ フルスタック＆AIエンジニアより
> **Google AI Studio (Gemini 2.0 / 2.5 Flash API)** を活用することで、超低遅延・構造化JSONレスポンス（Structured Output）を備えた本物のAI機能をWebアプリケーションに即座に組み込むことができます。

---

## 🛠️ 基本コード例 (FastAPI + Gemini)

```python
import urllib.request
import json
import os

API_KEY = os.environ.get("GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

payload = {
    "contents": [{"parts": [{"text": "洗練されたブランドコピーをJSONで生成してください"}]}],
    "generationConfig": {
        "responseMimeType": "application/json"
    }
}

req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode("utf-8"))
    print(data["candidates"][0]["content"]["parts"][0]["text"])
```

---

## 🔗 関連リンク
- 💼 実践制作: [[03_creative_brand_lp/README|03. AURA - Creative Brand LP]]
- ⚡ バックエンド: [[10_Concepts/FastAPI入門と非同期処理|FastAPI入門と非同期処理]]
- 🗺️ [[00_ポートフォリオ総合マップ|ポートフォリオ総合マップ]]
