import jwt as pyjwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import settings
from models import TokenData

security = HTTPBearer()


async def verify_token(token: str) -> TokenData:
    """Verify and decode our own HS256 JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = pyjwt.decode(
            token,
            settings.secret_key,
            algorithms=["HS256"],
        )
        return TokenData(
            sub=payload["sub"],
            email=payload.get("email"),
            name=payload.get("name"),
            picture=payload.get("picture"),
        )
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except pyjwt.PyJWTError:
        raise credentials_exception


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> TokenData:
    """FastAPI dependency — injects the verified user into route handlers."""
    return await verify_token(credentials.credentials)
