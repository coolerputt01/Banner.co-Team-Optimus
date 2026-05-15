import httpx
from jose import jwt, JWTError
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import settings, AUTH0_JWKS_URL, AUTH0_BASE_URL
from models import TokenData

security = HTTPBearer()

# Cache JWKS to avoid fetching on every request
_jwks_cache: dict | None = None

async def get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache is None:
        async with httpx.AsyncClient() as client:
            resp = await client.get(AUTH0_JWKS_URL)
            resp.raise_for_status()
            _jwks_cache = resp.json()
    return _jwks_cache

async def verify_token(token: str) -> TokenData:
    """Verify and decode an Auth0 JWT access token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        jwks = await get_jwks()

        # Decode header to find the key ID (kid)
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header.get("kid"):
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "n":   key["n"],
                    "e":   key["e"],
                }
                break

        if not rsa_key:
            raise credentials_exception

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=settings.auth0_audience,
            issuer=f"{AUTH0_BASE_URL}/",
        )

        return TokenData(
            sub=payload["sub"],
            email=payload.get("email"),
            name=payload.get("name"),
            picture=payload.get("picture"),
        )

    except JWTError:
        raise credentials_exception

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> TokenData:
    """FastAPI dependency — injects the verified user into route handlers."""
    return await verify_token(credentials.credentials)