from fastapi import FastAPI
from backend.database.connection import engine
from backend.database.models import Base
from contextlib import asynccontextmanager
from backend.routers import projectFeatures, projects, auth, users, documents, testcases, testscripts
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from backend.core.rate_limiter import limiter, rate_limit_exceeded_handler
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://testlab-workspace.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

@app.get("/healthy")
async def health():
    return {"status": "Healthy"}

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(projectFeatures.router)
app.include_router(documents.router)
app.include_router(testcases.router)
app.include_router(testscripts.router)
