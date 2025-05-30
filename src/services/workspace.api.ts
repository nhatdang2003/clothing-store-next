import httpClient from "./axios-config";

export const workspaceApi = {
    login: async (data: any) => {
        const response = await httpClient.post("/api/auth/workspace", data);
        return response;
    },
};
