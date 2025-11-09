import axiosInstance from "../lib/axios";

export const sessionsApi = {
  /**
   * Creates a new interview session
   * @param {Object} data - Session configuration
   * @param {string} data.problemTitle - Title of the coding problem
   * @param {string} data.difficulty - Problem difficulty (lowercase)
   * @returns {Promise<{session: Object}>} Created session data
   */
  async createSession(data) {
    const { data: sessionData } = await axiosInstance.post("/sessions", data);

    return sessionData;
  },

  async getActiveSessions() {
    const { data: activeSessionsData } = await axiosInstance.get(
      "/sessions/active"
    );

    return activeSessionsData;
  },

  async getRecentSessions() {
    const { data: recentSessionsData } = await axiosInstance.get(
      "/sessions/recent"
    );

    return recentSessionsData;
  },

  async getSessionById(sessionId) {
    const { data: sessionData } = await axiosInstance.get(
      `/sessions/${sessionId}`
    );

    return sessionData;
  },

  async joinSession(sessionId) {
    const { data } = await axiosInstance.post(`/sessions/${sessionId}/join`);

    return data;
  },

  async endSession(sessionId) {
    const { data } = await axiosInstance.post(`/sessions/${sessionId}/end`);

    return data;
  },

  async getStreamToken() {
    const { data } = await axiosInstance.get("/chats/token");

    return data;
  },
};
