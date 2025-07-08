from pydantic import BaseModel, validator
from typing import Optional
from app.exceptions import CustomException


class TodoModelValidatorMixin:
    @validator("title")
    def validate_title(cls, value):
        if not value.strip():
            raise CustomException(
                status=400, message="This field cannot be blank", key="title"
            )
        return value
    
    
class TodoModel(BaseModel):
    id: int
    title: str
    completed: bool

    class Config:
        from_attributes=True 
    

class TodoCreateModel(BaseModel, TodoModelValidatorMixin):
    title: str
    completed: bool = False


class TodoUpdateModel(BaseModel, TodoModelValidatorMixin):
    title: Optional[str] = None
    completed: Optional[bool] = None
