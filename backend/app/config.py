from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MaargMitra API"
    app_version: str = "0.1.0"
    api_prefix: str = "/api/v1"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    cors_origins: str = (
        "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,"
        "http://localhost:5177,http://localhost:5178,"
        "http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://127.0.0.1:5176,"
        "http://127.0.0.1:5177,http://127.0.0.1:5178"
    )

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)


settings = Settings()
