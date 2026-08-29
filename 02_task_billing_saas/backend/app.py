import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from database import get_db, init_db

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR)
CORS(app)

init_db()

@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND_DIR, path)

@app.route("/api/summary", methods=["GET"])
def get_summary():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COALESCE(SUM(duration_seconds), 0) FROM time_logs")
    total_seconds = cursor.fetchone()[0]
    total_hours = round(total_seconds / 3600.0, 1)

    cursor.execute("SELECT COALESCE(SUM(total_amount), 0) FROM invoices")
    total_revenue = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tasks WHERE status != 'done'")
    active_tasks = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tasks WHERE status = 'done'")
    done_tasks = cursor.fetchone()[0]

    conn.close()
    return jsonify({
        "status": "success",
        "total_hours": total_hours,
        "total_revenue": int(total_revenue),
        "active_tasks": active_tasks,
        "done_tasks": done_tasks
    })

@app.route("/api/projects", methods=["GET", "POST"])
def api_projects():
    conn = get_db()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute("SELECT * FROM projects ORDER BY id DESC")
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"status": "success", "data": rows})

    elif request.method == "POST":
        data = request.get_json(silent=True) or {}
        name = data.get("name", "").strip()
        client_name = data.get("client_name", "").strip()
        hourly_rate = float(data.get("hourly_rate", 5000))
        color = data.get("color", "#6366f1")

        if not name or not client_name:
            return jsonify({"status": "error", "message": "プロジェクト名とクライアント名は必須です"}), 400

        cursor.execute("INSERT INTO projects (name, client_name, hourly_rate, color) VALUES (?, ?, ?, ?)",
                       (name, client_name, hourly_rate, color))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return jsonify({"status": "success", "id": new_id, "message": "プロジェクトを作成しました"}), 201

@app.route("/api/tasks", methods=["GET", "POST"])
def api_tasks():
    conn = get_db()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute('''
            SELECT t.*, p.name as project_name, p.client_name, p.color as project_color, p.hourly_rate
            FROM tasks t
            LEFT JOIN projects p ON t.project_id = p.id
            ORDER BY t.id DESC
        ''')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"status": "success", "data": rows})

    elif request.method == "POST":
        data = request.get_json(silent=True) or {}
        title = data.get("title", "").strip()
        project_id = data.get("project_id")
        description = data.get("description", "").strip()
        priority = data.get("priority", "medium")
        status = data.get("status", "todo")

        if not title:
            return jsonify({"status": "error", "message": "タスク名は必須です"}), 400

        cursor.execute("INSERT INTO tasks (project_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)",
                       (project_id, title, description, status, priority))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return jsonify({"status": "success", "id": new_id, "message": "タスクを作成しました"}), 201

@app.route("/api/tasks/<int:task_id>", methods=["PATCH", "DELETE"])
def api_task_detail(task_id):
    conn = get_db()
    cursor = conn.cursor()

    if request.method == "PATCH":
        data = request.get_json(silent=True) or {}
        fields = []
        values = []
        for key in ["title", "description", "status", "priority", "project_id"]:
            if key in data:
                fields.append(f"{key} = ?")
                values.append(data[key])

        if not fields:
            return jsonify({"status": "error", "message": "更新データがありません"}), 400

        values.append(task_id)
        cursor.execute(f"UPDATE tasks SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "タスクを更新しました"})

    elif request.method == "DELETE":
        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "タスクを削除しました"})

@app.route("/api/timelogs", methods=["GET", "POST"])
def api_timelogs():
    conn = get_db()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute('''
            SELECT tl.*, p.name as project_name, p.client_name, p.hourly_rate, t.title as task_title
            FROM time_logs tl
            JOIN projects p ON tl.project_id = p.id
            LEFT JOIN tasks t ON tl.task_id = t.id
            ORDER BY tl.id DESC
        ''')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"status": "success", "data": rows})

    elif request.method == "POST":
        data = request.get_json(silent=True) or {}
        project_id = data.get("project_id")
        task_id = data.get("task_id")
        duration_seconds = int(data.get("duration_seconds", 0))
        started_at = data.get("started_at", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        ended_at = data.get("ended_at", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        notes = data.get("notes", "")

        if not project_id or duration_seconds <= 0:
            return jsonify({"status": "error", "message": "有効な稼働時間を指定してください"}), 400

        cursor.execute('''
            INSERT INTO time_logs (project_id, task_id, duration_seconds, started_at, ended_at, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (project_id, task_id, duration_seconds, started_at, ended_at, notes))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return jsonify({"status": "success", "id": new_id, "message": "稼働ログを保存しました"}), 201

@app.route("/api/invoices", methods=["GET", "POST"])
def api_invoices():
    conn = get_db()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute('''
            SELECT inv.*, p.name as project_name
            FROM invoices inv
            JOIN projects p ON inv.project_id = p.id
            ORDER BY inv.id DESC
        ''')
        rows = []
        for r in cursor.fetchall():
            d = dict(r)
            d["items"] = json.loads(d["items_json"]) if d["items_json"] else []
            rows.append(d)
        conn.close()
        return jsonify({"status": "success", "data": rows})

    elif request.method == "POST":
        data = request.get_json(silent=True) or {}
        project_id = data.get("project_id")
        client_name = data.get("client_name", "").strip()
        items = data.get("items", [])
        tax_rate = float(data.get("tax_rate", 0.10))

        if not project_id or not items:
            return jsonify({"status": "error", "message": "請求項目が必要です"}), 400

        subtotal = sum(item.get("amount", 0) for item in items)
        tax_amount = round(subtotal * tax_rate)
        total_amount = subtotal + tax_amount

        inv_num = f"INV-{datetime.now().strftime('%Y%m')}-{int(datetime.now().timestamp()) % 10000:04d}"
        issue_date = datetime.now().strftime("%Y-%m-%d")
        due_date = data.get("due_date", issue_date)

        cursor.execute('''
            INSERT INTO invoices (invoice_number, client_name, project_id, issue_date, due_date, subtotal, tax_rate, tax_amount, total_amount, status, items_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (inv_num, client_name, project_id, issue_date, due_date, subtotal, tax_rate, tax_amount, total_amount, "draft", json.dumps(items)))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return jsonify({"status": "success", "id": new_id, "invoice_number": inv_num, "message": "請求書を作成しました"}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5055, debug=True)
