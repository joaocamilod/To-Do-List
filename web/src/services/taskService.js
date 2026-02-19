import api from "./api";

export const taskService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.listId) params.append("listId", filters.listId);
    if (filters.completed !== undefined)
      params.append("completed", filters.completed);
    if (filters.myDay) params.append("myDay", true);
    if (filters.planned) params.append("planned", true);
    if (filters.search) params.append("search", filters.search);
    const { data } = await api.get(`/tasks?${params.toString()}`);
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  async create(taskData) {
    const { data } = await api.post("/tasks", taskData);
    return data;
  },

  async update(id, taskData) {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data;
  },

  async delete(id) {
    await api.delete(`/tasks/${id}`);
  },

  async toggleComplete(id) {
    const { data } = await api.patch(`/tasks/${id}/toggle-complete`);
    return data;
  },

  async reorder(taskIds) {
    const { data } = await api.patch("/tasks/reorder", { taskIds });
    return data;
  },

  async createSubtask(taskId, subtaskData) {
    const { data } = await api.post(`/tasks/${taskId}/subtasks`, subtaskData);
    return data;
  },

  async updateSubtask(taskId, subtaskId, subtaskData) {
    const { data } = await api.put(
      `/tasks/${taskId}/subtasks/${subtaskId}`,
      subtaskData,
    );
    return data;
  },

  async deleteSubtask(taskId, subtaskId) {
    await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  },

  async toggleSubtask(taskId, subtaskId) {
    const { data } = await api.patch(
      `/tasks/${taskId}/subtasks/${subtaskId}/toggle`,
    );
    return data;
  },
};
