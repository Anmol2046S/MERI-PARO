import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.routes.resume_routes import router as resume_router
from app.routes.prediction_routes import router as prediction_router
from app.routes.recommendation_routes import router as recommendation_router
from app.services.ml_service import MLService
from app.services.dl_service import DLService

logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
logger = logging.getLogger(__name__)

ml_service_instance = None
dl_service_instance = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global ml_service_instance, dl_service_instance
    logger.info("Initializing AI models...")

    ml_service_instance = MLService()
    ml_service_instance.initialize()
    app.state.ml_service = ml_service_instance

    dl_service_instance = DLService()
    dl_service_instance.initialize()
    app.state.dl_service = dl_service_instance

    logger.info("AI models initialized successfully")
    yield
    logger.info("Shutting down AI service")


app = FastAPI(
    title="MERI PARO AI Service",
    description="AI/ML microservice for career intelligence and job prediction",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router, prefix="/api/resume", tags=["Resume"])
app.include_router(prediction_router, prefix="/api/predict", tags=["Prediction"])
app.include_router(recommendation_router, prefix="/api/recommendations", tags=["Recommendations"])


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "meri-paro-ai-service",
        "models_loaded": ml_service_instance is not None,
    }


@app.get("/")
async def root():
    return {"message": "MERI PARO AI Service", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        log_level=settings.LOG_LEVEL,
    )
