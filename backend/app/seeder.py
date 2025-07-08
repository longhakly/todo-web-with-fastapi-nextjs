from app.database import Todo, INITIAL_DATA
from sqlalchemy.orm import Session


def seed_data(db: Session):
    if db.query(Todo).count() == 0:
        todos = []
        for _st in INITIAL_DATA:
            todo = Todo(title=_st["title"], completed=_st["completed"])
            todos.append(todo)

        db.add_all(todos)
        db.commit()
        print("✅ Seeded initial data.")
    else:
        print("⚠️ Data already exists, skipping seeding.")
