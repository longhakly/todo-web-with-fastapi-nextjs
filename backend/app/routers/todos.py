from typing import List

from app.config.sqlite import db_session
from app.database import TodoModel
from app.exceptions import CustomException
from app.models import TodoCreateSerializer, TodoSerializer, TodoUpdateSerializer
from fastapi import Depends, status
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.orm import Session


router = InferringRouter()


@cbv(router)
class TodoView:
    db: Session = Depends(db_session)
    model = TodoModel()

    @router.get("/", response_model=List[TodoSerializer])
    def list(self):
        return self.model.get_all_todos(self.db)

    @router.post("/", response_model=TodoSerializer)
    def create(self, data: TodoCreateSerializer):
        return self.model.create_todo(self.db, data.dict())

    @router.get("/{id}", response_model=TodoSerializer)
    def get(self, id: int):
        instance = self.model.get_todo_by_id(self.db, id)
        self.__validate_existing_todo_instance(instance)
        return instance

    @router.put("/{id}", response_model=TodoSerializer)
    def update(self, id: int, data: TodoUpdateSerializer):
        instance = self.model.update_todo(self.db, id, data.dict(exclude_unset=True))
        self.__validate_existing_todo_instance(instance)
        return instance

    @router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete(self, id: int):
        instance = self.model.delete_todo(self.db, id)
        self.__validate_existing_todo_instance(instance)
        return

    def __validate_existing_todo_instance(self, instance):
        if not instance:
            raise CustomException(
                status=status.HTTP_404_NOT_FOUND, message="Todo not found"
            )
