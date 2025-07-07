from pydantic import BaseModel
from typing import Optional


class TodoSerializer(BaseModel):
    id: int
    title: str
    completed: bool

    class Config:
        from_attributes=True 


class TodoCreateSerializer(BaseModel):
    title: str
    completed: bool = False


class TodoUpdateSerializer(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
