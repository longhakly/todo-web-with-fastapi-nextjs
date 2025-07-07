from app.config.sqlite import SessionLocal
from app.database import TodoModel, STRUCTURE_DATA
from sqlalchemy.orm import Session


def seed_data(db: Session):
    if db.query(TodoModel).count() == 0:
        todos = []
        for _st in STRUCTURE_DATA:
            todo = TodoModel(title=_st["title"], completed=_st["completed"])
            todos.append(todo)

        db.add_all(todos)
        db.commit()
        print("✅ Seeded initial data.")
    else:
        print("⚠️ Data already exists, skipping seeding.")