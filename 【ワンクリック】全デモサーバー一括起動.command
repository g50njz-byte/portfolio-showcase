#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "🚀 全5大ポートフォリオのローカルサーバーを一括起動します..."
echo "=================================================="

# 00. メインポータル (Port 8000)
python3 -m http.server 8000 > /dev/null 2>&1 &
PID_PORTAL=$!
echo "✅ [Port 8000] メイン総合ポータル"

# 01. AIデータ分析ダッシュボード (Port 8080)
if [ -d "01_ai_data_dashboard" ]; then
    cd 01_ai_data_dashboard
    python3 -m http.server 8080 > /dev/null 2>&1 &
    cd ..
    echo "✅ [Port 8080] AIデータ分析ダッシュボード"
fi

# 02. TaskFlow & 請求書SaaS (Port 5055)
if [ -d "02_task_billing_saas" ]; then
    cd 02_task_billing_saas
    python3 -m http.server 5055 > /dev/null 2>&1 &
    cd ..
    echo "✅ [Port 5055] TaskFlow & 請求書SaaS"
fi

# 03. AURA クリエイティブLP (Port 8090)
if [ -d "03_creative_brand_lp" ]; then
    cd 03_creative_brand_lp
    python3 -m http.server 8090 > /dev/null 2>&1 &
    cd ..
    echo "✅ [Port 8090] AURA クリエイティブLP"
fi

# 04. LUMEN EC＆予約プラットフォーム (Port 8095)
if [ -d "04_modern_ec_booking" ]; then
    cd 04_modern_ec_booking
    python3 -m http.server 8095 > /dev/null 2>&1 &
    cd ..
    echo "✅ [Port 8095] LUMEN EC＆予約プラットフォーム"
fi

echo "=================================================="
echo "🎉 全デモサーバーの起動が完了しました！"
echo "👉 ブラウザで開く: http://localhost:8000"
echo "（このターミナルウィンドウを閉じるとサーバーが停止します）"
echo "=================================================="

# ブラウザを自動で開く
open http://localhost:8000

# 待機
wait
