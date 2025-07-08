"use client";
import { ErrorInterface } from "@/interfaces/errors";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isEditing: boolean;
  loading: boolean;
  errors: ErrorInterface | null;
  actionLoading: boolean;
}

export default function TodoForm({
  input,
  setInput,
  onSubmit,
  isEditing,
  loading,
  errors,
  actionLoading,
}: Props) {
  const errorMessage = (key: string) => {
    if (errors?.errors?.length) {
      return errors.errors.find((err) => err.key === key)?.detail || "";
    }
  };

  return (
    <div className="relative flex gap-2">
      <input
        className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#1d3557]"
        placeholder="Enter a task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        disabled={loading}
      />
      <div className="absolute top-[-10px] px-2 left-2 bg-gray-50 rounded-sm">
        <span className="text-red-800 text-xs">{errorMessage("title")}</span>
      </div>
      <button
        className="bg-[#1d3557] text-white px-4 py-2 rounded-lg hover:bg-[#457b9d] flex items-center justify-center gap-2 min-w-[80px]"
        onClick={onSubmit}
        disabled={loading}
      >
        {actionLoading ? (
          <Icon
            icon="mynaui:spinner-one"
            width="20"
            height="20"
            className="animate-spin"
          />
        ) : isEditing ? (
          "Update"
        ) : (
          "Add"
        )}
      </button>
    </div>
  );
}
