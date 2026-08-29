import os
import sqlite3
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ecommerce.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price INTEGER NOT NULL,
        stock INTEGER NOT NULL DEFAULT 10,
        image_icon TEXT NOT NULL DEFAULT "package",
        description TEXT NOT NULL,
        rating REAL DEFAULT 4.8
    );
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        subtotal INTEGER NOT NULL,
        discount INTEGER NOT NULL DEFAULT 0,
        tax INTEGER NOT NULL,
        total INTEGER NOT NULL,
        items_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_name TEXT NOT NULL,
        booking_date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        status TEXT DEFAULT "confirmed",
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        sample_products = [
            ("AURA Ceramic Diffuser", "Wellness", 12800, 15, "wind", "手仕事の温もりと超音波テクノロジーが融合した、極上アロマディフューザー。", 4.9),
            ("Titanium Coffee Dripper", "Lifestyle", 8400, 22, "coffee", "航空宇宙グレードの純チタンから削り出された、雑味のない至高のドリップ体験。", 4.8),
            ("Minimal Leather Folio", "Lifestyle", 16500, 8, "book-open", "植物タンニン鞣しイタリアンレザーを使用した、一生モノの多機能ドキュメントケース。", 4.9),
            ("Acoustic Brass Bell", "Wellness", 6200, 30, "bell", "心地よい倍音と長い余韻が空間を清める、真鍮削り出しの瞑想用デスクベル。", 4.7),
            ("Precision Studio Headphone", "Audio", 42000, 12, "headphones", "フラットな周波数特性と圧倒的な空間再現性を誇る、リファレンスモニター。", 5.0),
            ("Organic Botanical Candle", "Wellness", 4800, 25, "flame", "天然ソイワックスと高地ラベンダー精油を使用した、煤の出ないクリーンキャンドル。", 4.6),
        ]
        for p in sample_products:
            cursor.execute("INSERT INTO products (name, category, price, stock, image_icon, description, rating) VALUES (?, ?, ?, ?, ?, ?, ?)", p)

        sample_bookings = [
            ("プレミアム音響プライベート試聴会", "2026-09-05", "14:00 - 15:00", "佐藤 健一", "sato@example.com"),
            ("ハンドドリップ抽出マスタークラス", "2026-09-06", "11:00 - 12:30", "田中 美咲", "tanaka@example.com")
        ]
        for b in sample_bookings:
            cursor.execute("INSERT INTO bookings (service_name, booking_date, time_slot, customer_name, email) VALUES (?, ?, ?, ?, ?)", b)

    conn.commit()
    conn.close()
