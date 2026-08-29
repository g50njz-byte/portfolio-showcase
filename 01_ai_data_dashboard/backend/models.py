"""
Pydanticデータスキーマ定義
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class DatasetMetrics(BaseModel):
    total_samples: int
    features_count: int
    accuracy_score: float
    f1_score: float
    latency_ms: float


class FeatureImportance(BaseModel):
    feature_name: str
    importance: float
    category: str


class PredictionTrend(BaseModel):
    timestamp: str
    actual: Optional[float] = None
    predicted: float
    upper_bound: float
    lower_bound: float


class AIInsight(BaseModel):
    id: str
    title: str
    type: str  # "positive" | "warning" | "info"
    message: str
    impact_score: int


class DashboardDataResponse(BaseModel):
    status: str
    project_name: str
    version: str
    metrics: DatasetMetrics
    feature_importances: List[FeatureImportance]
    trends: List[PredictionTrend]
    insights: List[AIInsight]


class SimulationRequest(BaseModel):
    learning_rate: float = Field(0.01, ge=0.0001, le=1.0)
    epochs: int = Field(50, ge=10, le=500)
    batch_size: int = Field(32, ge=8, le=256)
    noise_level: float = Field(0.1, ge=0.0, le=1.0)
    target_metric: str = Field("revenue_growth", description="予測対象メトリクス")


class SimulationResponse(BaseModel):
    status: str
    simulated_accuracy: float
    converged_epoch: int
    estimated_roi: float
    simulated_trends: List[Dict[str, Any]]
    recommendations: List[str]
