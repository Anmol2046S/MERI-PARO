import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    NODE_API_URL: str = os.getenv("NODE_API_URL", "http://localhost:5000")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "trained_models")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")
    ALLOWED_ORIGINS: list = list(set(filter(None, [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:5173",
        os.getenv("FRONTEND_URL", ""),
    ])))


settings = Settings()
