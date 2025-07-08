import api from "@/lib/axios";
import {
  TodoInterface,
  TodoCreateInterface,
  TodoUpdateInterface,
} from "@/interfaces/todo";

export const TodoService = {
  getAll: async (): Promise<TodoInterface[]> => {
    const response = await api.get<TodoInterface[]>("/todos");
    return response.data;
  },

  getById: async (id: number): Promise<TodoInterface> => {
    const response = await api.get<TodoInterface>(`/todos/${id}`);
    return response.data;
  },

  create: async (data: TodoCreateInterface): Promise<TodoInterface> => {
    const response = await api.post<TodoInterface>("/todos", data);
    return response.data;
  },

  update: async (
    id: number,
    data: TodoUpdateInterface
  ): Promise<TodoInterface> => {
    const response = await api.put<TodoInterface>(`/todos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};
