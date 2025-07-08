"use client";
import { TodoInterface } from "@/interfaces/todo";
import { Icon } from "@iconify/react";

interface Props {
  todo: TodoInterface;
  onToggle: (id: number) => void;
  onEdit: (todo: TodoInterface) => void;
  onDelete: (id: number) => void;
  editId: number | null;
}

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  editId,
}: Props) {
  return (
    <li
      className={`flex items-center justify-between bg-white p-4 rounded shadow ${
        editId === todo.id ? "border border-[#457b9d]" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <p
          className={`text-sm ${
            todo.completed ? "line-through text-gray-400" : "text-gray-700"
          }`}
        >
          {todo.title}
        </p>
      </div>
      {editId !== todo.id ? (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(todo)}
            className="text-blue-600 hover:underline"
          >
            <Icon icon="mynaui:edit-one" width="20" height="20" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-500 hover:underline"
          >
            <Icon icon="ic:baseline-delete-outline" width="20" height="20" />
          </button>
        </div>
      ) : (
        <p className="text-sm text-[#457b9d]">Editing</p>
      )}
    </li>
  );
}
