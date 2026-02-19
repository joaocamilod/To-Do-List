import api from "./api";

export const listService = {
  async getAll() {
    const { data } = await api.get("/lists");
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/lists/${id}`);
    return data;
  },

  async create(listData) {
    const { data } = await api.post("/lists", listData);
    return data;
  },

  async update(id, listData) {
    const { data } = await api.put(`/lists/${id}`, listData);
    return data;
  },

  async delete(id) {
    await api.delete(`/lists/${id}`);
  },
};
