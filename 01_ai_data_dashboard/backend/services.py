"""
AI推論・統計分析・シミュレーションサービス
"""
import math
import random
from typing import List, Dict, Any
from datetime import datetime, timedelta
from models import (
    DatasetMetrics, FeatureImportance, PredictionTrend, AIInsight,
    DashboardDataResponse, SimulationRequest, SimulationResponse
)


def get_dashboard_summary() -> DashboardDataResponse:
    """ダッシュボードの初期表示用AI分析サマリーを生成"""
    metrics = DatasetMetrics(
        total_samples=128500,
        features_count=42,
        accuracy_score=94.8,
        f1_score=92.4,
        latency_ms=14.2
    )

    feature_importances = [
        FeatureImportance(feature_name="ユーザー過去エンゲージメント", importance=34.5, category="行動履歴"),
        FeatureImportance(feature_name="リアルタイム滞在時間", importance=22.8, category="行動履歴"),
        FeatureImportance(feature_name="コンバージョン確率スコア", importance=18.4, category="AI推論"),
        FeatureImportance(feature_name="曜日・時間帯ファクター", importance=12.1, category="コンテキスト"),
        FeatureImportance(feature_name="参照元チャネル重み", importance=8.2, category="流入経路"),
        FeatureImportance(feature_name="デバイス・OS属性", importance=4.0, category="属性情報"),
    ]

    # トレンドデータの生成（直近14日）
    trends: List[PredictionTrend] = []
    base_val = 1500.0
    now = datetime.now()

    for i in range(14):
        day = now - timedelta(days=13 - i)
        date_str = day.strftime("%m/%d")
        
        # サインカーブ + トレンド上昇 + ノイズ
        trend_val = base_val + (i * 45) + 120 * math.sin(i * 0.8)
        actual = trend_val + random.uniform(-30, 30) if i < 10 else None
        predicted = trend_val
        upper = predicted + 80 + (i * 3)
        lower = max(0, predicted - 80 - (i * 3))

        trends.append(PredictionTrend(
            timestamp=date_str,
            actual=round(actual, 1) if actual is not None else None,
            predicted=round(predicted, 1),
            upper_bound=round(upper, 1),
            lower_bound=round(lower, 1)
        ))

    insights = [
        AIInsight(
            id="ins-1",
            title="🎯 高確度コンバージョン群の検知",
            type="positive",
            message="エンゲージメントスコア85以上のユーザー群において、成約予測確率が前週比 +18.4% 上昇しています。",
            impact_score=92
        ),
        AIInsight(
            id="ins-2",
            title="⚠️ レイテンシ警告（ピーク時間帯）",
            type="warning",
            message="20:00〜22:00のアクセス集中時に推論レイテンシが18msを超過する傾向があります。キャッシュ層の増強を推奨します。",
            impact_score=74
        ),
        AIInsight(
            id="ins-3",
            title="💡 特徴量ドリフトの軽微な検出",
            type="info",
            message="「参照元チャネル」の分布に直近3日間で約4.2%のシフトが見られます。週末の再学習パイプライン実行を推奨。",
            impact_score=65
        )
    ]

    return DashboardDataResponse(
        status="success",
        project_name="AI Analytics & Prediction Core",
        version="v1.4.0",
        metrics=metrics,
        feature_importances=feature_importances,
        trends=trends,
        insights=insights
    )


def run_ai_simulation(req: SimulationRequest) -> SimulationResponse:
    """パラメータ変更によるリアルタイム推論シミュレーション"""
    # パラメータに応じたシミュレーション計算
    lr_factor = math.exp(-abs(req.learning_rate - 0.01) * 20)
    epoch_factor = 1.0 - math.exp(-req.epochs / 80)
    noise_penalty = (1.0 - req.noise_level * 0.4)

    simulated_acc = round(min(98.9, (85.0 + 13.0 * lr_factor * epoch_factor) * noise_penalty), 2)
    converged_epoch = min(req.epochs, int(25 / max(0.001, req.learning_rate * 50)))
    estimated_roi = round(simulated_acc * 1.85 - 50.0, 1)

    # シミュレーション推移
    sim_trends = []
    current_acc = 50.0
    for ep in range(1, req.epochs + 1, max(1, req.epochs // 15)):
        progress = ep / req.epochs
        acc = 50.0 + (simulated_acc - 50.0) * (1 - math.exp(-progress * 4)) + random.uniform(-0.8, 0.8)
        loss = max(0.05, 1.2 * math.exp(-progress * 3.5) + req.noise_level * 0.1)
        sim_trends.append({
            "epoch": ep,
            "accuracy": round(min(100.0, acc), 2),
            "loss": round(loss, 3)
        })

    recommendations = []
    if req.learning_rate > 0.1:
        recommendations.append("学習率が高すぎるため発散のリスクがあります。0.01〜0.03への微調整を推奨します。")
    if req.epochs < 30:
        recommendations.append("エポック数が少ないため未学習の可能性があります。50エポック以上での検証を推奨します。")
    if simulated_acc >= 92.0:
        recommendations.append("高い予測精度を維持できています。本番モデルへのデプロイ基準を満たしています。")

    return SimulationResponse(
        status="success",
        simulated_accuracy=simulated_acc,
        converged_epoch=converged_epoch,
        estimated_roi=estimated_roi,
        simulated_trends=sim_trends,
        recommendations=recommendations
    )
