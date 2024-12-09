import http from "./http";

export const workspaceApi = {
  login: async (data: any) => {
    const response = await http.post({
      url: "/api/auth/workspace",
      base_url: "",
      body: data,
    });
    return response;
  },
};
