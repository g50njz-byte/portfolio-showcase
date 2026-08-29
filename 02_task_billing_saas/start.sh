#!/bin/bash
# TaskFlow & Invoice SaaS 起動スクリプト

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "🚀 TaskFlow & Invoice SaaS を起動しています..."
echo "=================================================="

# 仮想環境の確認と作成
if [ ! -d "venv" ] || [ ! -f "venv/bin/flask" ]; then
    echo "📦 仮想環境をセットアップしています (Flask / SQLite)..."
    rm -rf venv
    python3 -m venv venv
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r backend/requirements.txt
fi

source venv/bin/activate

PORT=5055
echo "🚀 Flask サーバーを起動します (ポート: $PORT)"
echo "👉 SaaS アプリを開く: http://localhost:$PORT"
echo "終了するには Ctrl + C を押してください。"
echo "=================================================="

cd backend
python3 app.py
