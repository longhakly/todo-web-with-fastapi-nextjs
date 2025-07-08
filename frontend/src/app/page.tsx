"use client";
import { useState, useEffect } from "react";
import {
  TodoInterface,
  TodoCreateInterface,
  TodoUpdateInterface,
} from "@/interfaces/todo";
import { TodoService } from "@/services/todo";
import { ErrorInterface } from "@/interfaces/errors";
import { Icon } from '@iconify/react';


export default function Home() {
  const [todos, setTodos] = useState<TodoInterface[]>([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorInterface | null>(null);

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

  const handleAdd = async () => {
    setErrors(null);
    if (editId !== null) {
      try {
        const updatedTodo: TodoUpdateInterface = { title: input.trim() };
        const updated = await TodoService.update(editId, updatedTodo);
        setTodos(todos.map((t) => (t.id === editId ? updated : t)));
        setEditId(null);
        setInput("");
      } catch (error: any) {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
          setInput("");
          setEditId(null);
        }
      }
    } else {
      try {
        const newTodo: TodoCreateInterface = {
          title: input.trim(),
          completed: false,
        };
        const created = await TodoService.create(newTodo);
        setTodos([created, ...todos]);
        setInput("");
      } catch (error: any) {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
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
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  function errorMessage(key: string) {
    if (errors && errors.errors && errors.errors.length > 0) {
      return errors.errors.find((error) => error.key === key)?.detail || "";
    }
  }

  const handleEdit = (todo: TodoInterface) => {
    setEditId(todo.id);
    setInput(todo.title);
    setErrors(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await TodoService.delete(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] gap-8 p-6 sm:p-12 bg-gray-50 font-sans">
      <header className="text-center">
        <h1 className="xs:2xl sm:2xl lg:text-3xl text-gray-600 font-bold">
          Todo Simple
        </h1>
      </header>

      <main className="w-full max-w-xl mx-auto flex flex-col gap-6">
        <div className="relative flex gap-2">
          <input
            className="relative flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#1d3557]"
            placeholder="Enter a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            disabled={loading}
          />
          <div className="absolute top-[-10px] px-2 left-2 bg-gray-50 rounded-sm">
            <span className="text-red-800 text-xs">
              {errorMessage("title")}
            </span>
          </div>
          <button
            className="bg-[#1d3557] text-white px-4 py-2 rounded-lg hover:bg-[#457b9d]"
            onClick={handleAdd}
            disabled={loading}
          >
            {editId !== null ? "Update" : "Add"}
          </button>
        </div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`${
                  editId == todo.id
                    ? "flex items-center justify-between bg-white border-1 border-[#457b9d]  p-4 rounded shadow"
                    : "flex items-center justify-between bg-white p-4 rounded shadow"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                  />
                  <span
                    className={`${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    <p className="text-sm">
                      {todo.title}
                    </p>
                  </span>
                </div>
                {todo.id != editId ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="text-blue-600 hover:underline"
                    >
                      <Icon icon="mynaui:edit-one" width="20" height="20" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-500 hover:underline"
                    >
                      <Icon icon="ic:baseline-delete-outline" width="20" height="20" />
                    </button>
                  </div>
                ) : <p className="text-sm text-[#457b9d]">Editing</p>}
              </li>
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
