from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    auth0_domain: str
    auth0_client_id: str
    auth0_client_secret: str
    auth0_audience: str
    app_base_url: str
    secret_key: str
    database_url: str
    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str

    class Config:
        env_file = ".env"

settings = Settings()

AUTH0_BASE_URL     = f"https://{settings.auth0_domain}"
AUTH0_JWKS_URL     = f"{AUTH0_BASE_URL}/.well-known/jwks.json"
AUTH0_TOKEN_URL    = f"{AUTH0_BASE_URL}/oauth/token"
AUTH0_AUTHORIZE_URL = f"{AUTH0_BASE_URL}/authorize"
AUTH0_LOGOUT_URL   = f"{AUTH0_BASE_URL}/v2/logout"
CALLBACK_URL      = f"https://animated-rotary-phone-x59gxvw69rxx3v6xv-8000.app.github.dev/auth/callback"