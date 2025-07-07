import os
from contextlib import asynccontextmanager

from app.config.sqlite import Base, SessionLocal, engine
from app.exceptions import CustomException
from app.routers.todos import router
from app.seeder import seed_data
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


# Load environment variables from .env file
load_dotenv()


# Create the database tables
Base.metadata.create_all(bind=engine)


# Auto-run seed on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    seed_data(db)
    db.close()
    yield


# Create FastAPI instance
app = FastAPI(
    title="Todo API",
    description="A simple todo management API built with FastAPI",
    version="1.0.0",
    lifespan=lifespan,
)


# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOW_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom exception handler
@app.exception_handler(CustomException)
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status,
        content={"detail": exc.message},
    )


# Include the todos router
app.include_router(router, prefix="/todos", tags=["todos"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Todo API is running!"}
