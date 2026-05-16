from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Auth0
    auth0_domain: str
    auth0_client_id: str
    auth0_client_secret: str
    auth0_audience: str

    # App
    app_base_url: str          # Backend base URL (used for Auth0 callback)
    frontend_url: str          # Frontend URL (used for post-login redirect & CORS)
    secret_key: str

    # Database
    database_url: str

    # Cloudinary
    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str

    # Squadco
    squad_secret_key: str
    squad_secret_hash: str
    squad_test_mode: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"  # ignore unknown env vars


settings = Settings()

AUTH0_BASE_URL      = f"https://{settings.auth0_domain}"
AUTH0_JWKS_URL      = f"{AUTH0_BASE_URL}/.well-known/jwks.json"
AUTH0_TOKEN_URL     = f"{AUTH0_BASE_URL}/oauth/token"
AUTH0_AUTHORIZE_URL = f"{AUTH0_BASE_URL}/authorize"
AUTH0_LOGOUT_URL    = f"{AUTH0_BASE_URL}/v2/logout"

# The callback URL Auth0 redirects to after login.
# Must match exactly what is registered in your Auth0 app settings.
CALLBACK_URL = f"{settings.app_base_url}/auth/callback"
