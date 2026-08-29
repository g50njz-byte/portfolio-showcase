#!/bin/bash
# Master Portfolio Portal 起動スクリプト

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

PORT=8000
echo "=================================================="
echo "👑 Master Portfolio Portal を起動しています..."
echo "=================================================="
echo "👉 ポートフォリオ総合ポータルを開く: http://localhost:$PORT"
echo "終了するには Ctrl + C を押してください。"
echo "=================================================="

python3 -m http.server $PORT
