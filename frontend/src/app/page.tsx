"use client";
import { useState, useEffect } from "react";
import {
  TodoInterface,
  TodoCreateInterface,
  TodoUpdateInterface,
} from "@/interfaces/todo";
import { TodoService } from "@/services/todo";
import { ErrorInterface } from "@/interfaces/errors";
import TodoItem from "@/components/TodoItem";
import TodoForm from "@/components/TodoForm";

export default function Home() {
  const [todos, setTodos] = useState<TodoInterface[]>([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorInterface | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      try {
        const data = await TodoService.getAll();
        setTodos(data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTodos();
  }, []);

  const handleCreateUpdate = async () => {
    setErrors(null);
    setActionLoading(true);

    if (editId !== null) {
      try {
        const updateData: TodoUpdateInterface = { title: input.trim() };
        const result: TodoInterface = await TodoService.update(
          editId,
          updateData
        );
        setTodos(todos.map((t) => (t.id === editId ? result : t)));
        setEditId(null);
        setInput("");
      } catch (error: any) {
        setErrors(error.response?.data || null);
      } finally {
        setActionLoading(false);
      }
    } else {
      try {
        const createData: TodoCreateInterface = {
          title: input.trim(),
          completed: false,
        };
        const created: TodoInterface = await TodoService.create(createData);
        setTodos([created, ...todos]);
        setInput("");
      } catch (error: any) {
        setErrors(error.response?.data || null);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const updated = await TodoService.update(id, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  const handleEdit = (todo: TodoInterface) => {
    setEditId(todo.id);
    setInput(todo.title);
    setErrors(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await TodoService.delete(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] gap-8 p-6 sm:p-12 bg-gray-50 font-sans">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-600">Todo Simple</h1>
      </header>

      <main className="w-full max-w-xl mx-auto flex flex-col gap-6">
        <TodoForm
          input={input}
          setInput={setInput}
          onSubmit={handleCreateUpdate}
          isEditing={editId !== null}
          loading={loading}
          errors={errors}
          actionLoading={actionLoading}
        />
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                editId={editId}
              />
            ))}
          </ul>
        )}
      </main>

      <footer className="text-center text-sm text-gray-400">
        &copy; 2025 Todo Simple
      </footer>
    </div>
  );
}
