#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "🚀 GitHub への最新ポートフォリオ同期を開始します..."
echo "=================================================="

git add .
git commit -m "feat: Update portfolio showcase ($(date '+%Y-%m-%d %H:%M:%S'))" 2>/dev/null || true
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "🎉 GitHub への同期が完了しました！"
    echo "👉 リポジトリURL: https://github.com/g50njz-byte/portfolio-showcase"
    echo "=================================================="
else
    echo "⚠️ 送信に失敗しました。"
fi

echo "何かキーを押すと終了します..."
read -n 1
