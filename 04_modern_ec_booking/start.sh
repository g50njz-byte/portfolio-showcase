#!/bin/bash
# LUMEN Modern EC & Booking Platform 起動スクリプト

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "🛍️ LUMEN Modern EC & Booking Platform を起動しています..."
echo "=================================================="

# 仮想環境の確認
if [ ! -d "venv" ] || [ ! -f "venv/bin/uvicorn" ]; then
    echo "📦 仮想環境をセットアップしています (FastAPI / SQLite)..."
    rm -rf venv
    python3 -m venv venv
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r backend/requirements.txt
fi

source venv/bin/activate

PORT=8095
echo "🚀 サーバーを起動します (ポート: $PORT)"
echo "👉 EC & 予約アプリを開く: http://localhost:$PORT"
echo "👉 FastAPI Swagger仕様書: http://localhost:$PORT/docs"
echo "終了するには Ctrl + C を押してください。"
echo "=================================================="

cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT --reload
