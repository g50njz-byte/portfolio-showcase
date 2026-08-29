---
tags:
  - database/sqlite
  - database/sql
  - python/db
  - level/intermediate
created: 2026-08-29
updated: 2026-08-29
---

# 📐 SQLite によるデータモデリング & リレーション設計

> [!abstract] ⚡ フルスタック＆AIエンジニアより
> **SQLite** は、サーバー構築不要で単一のファイル（`.db`）として動作する超軽量・高信頼なリレーショナルデータベースです。Python標準ライブラリ（`sqlite3`）で即座に扱えます。

---

## 🌟 リレーション（外部キー）の基本

複数のテーブルを「共通のID（外部キー）」で紐付けることで、データの重複を防ぎ、整合性を担保します。

* **1対多 (1:N)**:
  * 1つのプロジェクト（`projects.id`）に対して、複数のタスク（`tasks.project_id`）や稼働ログ（`time_logs.project_id`）が紐づく。

```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    hourly_rate REAL NOT NULL
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'todo',
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

---

## 🔗 関連リンク
- 💼 実践制作: [[02_task_billing_saas/README|02. TaskFlow & Invoice SaaS]]
- 🌶️ API連携: [[10_Concepts/FlaskとREST_APIの基礎|FlaskとREST APIの基礎]]
- 🗺️ [[00_ポートフォリオ総合マップ|ポートフォリオ総合マップ]]
