"""
FastAPI メインサーバー
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from models import DashboardDataResponse, SimulationRequest, SimulationResponse
from services import get_dashboard_summary, run_ai_simulation

app = FastAPI(
    title="AI Analytics & Prediction Engine API",
    description="FastAPI + Next.js + Tailwind CSS によるポートフォリオ用AIデータ分析エンジン",
    version="1.0.0"
)

# CORS設定（Next.js等の外部フロントエンドからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "AI Analytics Engine", "version": "1.0.0"}


@app.get("/api/dashboard", response_model=DashboardDataResponse)
async def api_get_dashboard():
    """ダッシュボードの初期データ取得"""
    try:
        return get_dashboard_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/simulate", response_model=SimulationResponse)
async def api_simulate(request: SimulationRequest):
    """ハイパーパラメータシミュレーション実行"""
    try:
        return run_ai_simulation(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# フロントエンド静的配信 (スタンドアロン起動時用)
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/")
    async def serve_index():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "Frontend index.html not found"}
