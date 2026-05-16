from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from config import settings

# Neon (and most hosted Postgres) requires SSL.
# asyncpg uses connect_args for SSL rather than query string params.
connect_args = {}
if "neon.tech" in settings.database_url or "sslmode" in settings.database_url:
    import ssl
    ssl_ctx = ssl.create_default_context()
    connect_args["ssl"] = ssl_ctx

# Strip any query string params — asyncpg doesn't accept them in the URL
_db_url = settings.database_url.split("?")[0]

engine = create_async_engine(
    _db_url,
    echo=False,
    pool_pre_ping=True,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

# FastAPI dependency
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session