import os
import json
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from database import get_db, init_db

app = FastAPI(
    title="Modern E-Commerce & Booking Platform API",
    description="React + Tailwind CSS + FastAPI + Stripe決済シミュレーション",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
init_db()


class CartItem(BaseModel):
    product_id: int
    quantity: int = Field(1, ge=1)


class CheckoutRequest(BaseModel):
    customer_name: str
    email: str
    items: List[CartItem]
    coupon_code: Optional[str] = None
    payment_method: str = "stripe_card"


class BookingRequest(BaseModel):
    service_name: str
    booking_date: str
    time_slot: str
    customer_name: str
    email: str


@app.get("/api/products")
async def get_products(category: Optional[str] = None, q: Optional[str] = None, sort: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM products WHERE 1=1"
    params = []

    if category and category != "All":
        query += " AND category = ?"
        params.append(category)

    if q:
        query += " AND (name LIKE ? OR description LIKE ?)"
        params.extend([f"%{q}%", f"%{q}%"])

    if sort == "price_asc":
        query += " ORDER BY price ASC"
    elif sort == "price_desc":
        query += " ORDER BY price DESC"
    else:
        query += " ORDER BY id ASC"

    cursor.execute(query, params)
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"status": "success", "data": products}


@app.post("/api/checkout")
async def checkout(req: CheckoutRequest):
    conn = get_db()
    cursor = conn.cursor()

    if not req.items:
        raise HTTPException(status_code=400, detail="カートが空です")

    subtotal = 0
    ordered_items = []

    for item in req.items:
        cursor.execute("SELECT * FROM products WHERE id = ?", (item.product_id,))
        prod = cursor.fetchone()
        if not prod:
            raise HTTPException(status_code=404, detail=f"商品ID {item.product_id} が見つかりません")
        
        prod_dict = dict(prod)
        if prod_dict["stock"] < item.quantity:
            raise HTTPException(status_code=400, detail=f"「{prod_dict['name']}」の在庫が不足しています (残り {prod_dict['stock']}点)")

        item_total = prod_dict["price"] * item.quantity
        subtotal += item_total
        ordered_items.append({
            "product_id": prod_dict["id"],
            "name": prod_dict["name"],
            "price": prod_dict["price"],
            "quantity": item.quantity,
            "total": item_total
        })

    discount = 0
    if req.coupon_code:
        code = req.coupon_code.strip().upper()
        if code == "SPECIAL10":
            discount = int(subtotal * 0.10)
        elif code == "WELCOME500":
            discount = 500

    taxable_amount = max(0, subtotal - discount)
    tax = int(taxable_amount * 0.10)
    total = taxable_amount + tax

    for item in req.items:
        cursor.execute("UPDATE products SET stock = stock - ? WHERE id = ?", (item.quantity, item.product_id))

    order_num = f"ORD-{datetime.now().strftime('%Y%m%d')}-{int(datetime.now().timestamp()) % 10000:04d}"
    cursor.execute("""
        INSERT INTO orders (order_number, customer_name, email, subtotal, discount, tax, total, items_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (order_num, req.customer_name, req.email, subtotal, discount, tax, total, json.dumps(ordered_items)))

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "order_number": order_num,
        "customer_name": req.customer_name,
        "subtotal": subtotal,
        "discount": discount,
        "tax": tax,
        "total": total,
        "items": ordered_items,
        "payment_status": "paid_via_stripe_simulator"
    }


@app.get("/api/bookings")
async def get_bookings():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookings ORDER BY booking_date ASC, time_slot ASC")
    bookings = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"status": "success", "data": bookings}


@app.post("/api/bookings")
async def create_booking(req: BookingRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COUNT(*) FROM bookings
        WHERE service_name = ? AND booking_date = ? AND time_slot = ?
    """, (req.service_name, req.booking_date, req.time_slot))
    
    if cursor.fetchone()[0] > 0:
        conn.close()
        raise HTTPException(status_code=400, detail="申し訳ありません。この日時はすでに満席となっております。別の時間をお選びください。")

    cursor.execute("""
        INSERT INTO bookings (service_name, booking_date, time_slot, customer_name, email)
        VALUES (?, ?, ?, ?, ?)
    """, (req.service_name, req.booking_date, req.time_slot, req.customer_name, req.email))

    conn.commit()
    booking_id = cursor.lastrowid
    conn.close()

    return {
        "status": "success",
        "booking_id": booking_id,
        "message": "ご予約が確定いたしました。確認メール（シミュレーション）を送信しました。"
    }


if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/")
    async def serve_index():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "index.html not found"}
