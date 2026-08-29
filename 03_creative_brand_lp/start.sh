#!/bin/bash
# AURA Creative Brand LP & Gemini AI 起動スクリプト

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "✨ AURA Creative Brand LP (Vue.js 3 + GSAP + Gemini) を起動しています..."
echo "=================================================="

# 仮想環境の確認
if [ ! -d "venv" ] || [ ! -f "venv/bin/uvicorn" ]; then
    echo "📦 仮想環境をセットアップしています (FastAPI / Uvicorn)..."
    rm -rf venv
    python3 -m venv venv
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r backend/requirements.txt
fi

source venv/bin/activate

PORT=8090
echo "🚀 サーバーを起動します (ポート: $PORT)"
echo "👉 クリエイティブLPを開く: http://localhost:$PORT"
echo "👉 FastAPI Swagger仕様書: http://localhost:$PORT/docs"
echo "終了するには Ctrl + C を押してください。"
echo "=================================================="

cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT --reload
