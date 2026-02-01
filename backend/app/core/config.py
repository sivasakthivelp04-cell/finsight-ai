
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List, Union, Any

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinSight AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_FOR_JWT_GeneraTiON_123"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./finsight_v2.db"

    # CORS
    # Treat it as Any or str in the model, and then parse it in validator
    BACKEND_CORS_ORIGINS: Any = ["*"]

    OPENAI_API_KEY: str = ""
    ENVIRONMENT: str = "development"

    # Email Service
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@finsight.ai"

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            import json
            if isinstance(v, str):
                try:
                    return json.loads(v)
                except:
                    return [i.strip() for i in v.split(",")]
            return v
        return v

    @field_validator("SMTP_HOST", "SMTP_USERNAME", "EMAIL_FROM", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip()
        return v

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
