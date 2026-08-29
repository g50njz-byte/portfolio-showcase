import os
import sqlite3
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "saas_app.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        client_name TEXT NOT NULL,
        hourly_rate REAL NOT NULL DEFAULT 5000,
        color TEXT NOT NULL DEFAULT "#6366f1",
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        title TEXT NOT NULL,
        description TEXT DEFAULT "",
        status TEXT NOT NULL DEFAULT "todo",
        priority TEXT NOT NULL DEFAULT "medium",
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS time_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER,
        project_id INTEGER NOT NULL,
        duration_seconds INTEGER NOT NULL,
        started_at TEXT NOT NULL,
        ended_at TEXT NOT NULL,
        notes TEXT DEFAULT "",
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id),
        FOREIGN KEY (project_id) REFERENCES projects(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_number TEXT NOT NULL UNIQUE,
        client_name TEXT NOT NULL,
        project_id INTEGER NOT NULL,
        issue_date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        subtotal REAL NOT NULL,
        tax_rate REAL NOT NULL DEFAULT 0.10,
        tax_amount REAL NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT "draft",
        items_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
    );
    """)

    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO projects (name, client_name, hourly_rate, color) VALUES (?, ?, ?, ?)",
                       ("ECサイトリニューアル", "株式会社ネクストコマース", 6500, "#6366f1"))
        p1_id = cursor.lastrowid

        cursor.execute("INSERT INTO projects (name, client_name, hourly_rate, color) VALUES (?, ?, ?, ?)",
                       ("AIチャットボット導入支援", "スマートソリューションズ合同会社", 8000, "#10b981"))
        p2_id = cursor.lastrowid

        cursor.execute("INSERT INTO tasks (project_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)",
                       (p1_id, "商品一覧APIのパフォーマンス改善", "レスポンス時間を200ms以下に最適化", "in_progress", "high"))
        t1_id = cursor.lastrowid
        cursor.execute("INSERT INTO tasks (project_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)",
                       (p1_id, "Stripe決済画面のUI実装", "Tailwind CSSでモダンなカード入力画面を作成", "done", "medium"))
        t2_id = cursor.lastrowid
        cursor.execute("INSERT INTO tasks (project_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)",
                       (p2_id, "LLMプロンプトエンジニアリング & テスト", "FAQ応答精度のベンチマーク検証", "todo", "high"))

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("INSERT INTO time_logs (task_id, project_id, duration_seconds, started_at, ended_at, notes) VALUES (?, ?, ?, ?, ?, ?)",
                       (t1_id, p1_id, 10800, now_str, now_str, "クエリ最適化とインデックス追加"))
        cursor.execute("INSERT INTO time_logs (task_id, project_id, duration_seconds, started_at, ended_at, notes) VALUES (?, ?, ?, ?, ?, ?)",
                       (t2_id, p1_id, 7200, now_str, now_str, "決済フォームとバリデーション実装"))

        items = [{"description": "ECサイトリニューアル (稼働 5.0時間)", "hours": 5.0, "rate": 6500, "amount": 32500}]
        cursor.execute("""
        INSERT INTO invoices (invoice_number, client_name, project_id, issue_date, due_date, subtotal, tax_rate, tax_amount, total_amount, status, items_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, ("INV-202608-001", "株式会社ネクストコマース", p1_id, "2026-08-25", "2026-09-30", 32500, 0.10, 3250, 35750, "sent", json.dumps(items)))

    conn.commit()
    conn.close()
