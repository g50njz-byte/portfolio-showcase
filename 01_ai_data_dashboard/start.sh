#!/bin/bash
# AI Analytics & Prediction Dashboard 堅牢な起動スクリプト

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "⚡ AI Analytics & Prediction Engine を起動しています..."
echo "=================================================="

# 仮想環境の存在と整合性チェック
if [ ! -d "venv" ] || [ ! -f "venv/bin/uvicorn" ]; then
    echo "📦 仮想環境をセットアップしています (FastAPI / Uvicorn)..."
    rm -rf venv
    python3 -m venv venv
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r backend/requirements.txt
fi

# 仮想環境をアクティベート
source venv/bin/activate

PORT=8080
echo "🚀 FastAPI サーバーを起動します (ポート: $PORT)"
echo "👉 ダッシュボードを開く: http://localhost:$PORT"
echo "👉 FastAPI Swagger仕様書: http://localhost:$PORT/docs"
echo "終了するには Ctrl + C を押してください。"
echo "=================================================="

cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT --reload
