from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# In memory SQLite database for testing purposes
DATABASE_URL = "sqlite://"

# Allowing the use of an in-memory SQLite database
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def db_session():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
