from sqlalchemy import Column, Integer, String, Boolean
from app.config.sqlite import Base


# Example structure:
# This will be set initially as seeder during runtime
INITIAL_DATA = [
    {"id": 1, "title": "Write documentation", "completed": False},
    {"id": 2, "title": "Review code", "completed": True},
]


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    completed = Column(Boolean, default=False)

    def get_all_todos(self, db):
        return db.query(Todo).all()

    def create_todo(self, db, data: dict):
        new_todo = Todo(**data)
        db.add(new_todo)
        db.commit()
        db.refresh(new_todo)
        return new_todo

    def get_todo_by_id(self, db, id: int):
        return db.query(Todo).filter(Todo.id == id).first()

    def update_todo(self, db, id: int, data: dict):
        todo = self.get_todo_by_id(db, id)
        if not todo:
            return None

        for key, value in data.items():
            setattr(todo, key, value)

        db.commit()
        db.refresh(todo)
        return todo

    def delete_todo(self, db, id: int):
        todo = self.get_todo_by_id(db, id)
        if not todo:
            return None

        db.delete(todo)
        db.commit()
        return todo
