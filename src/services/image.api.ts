import http from "./http";

export const imageApi = {
  getPresignedUrl: async (fileName: string) => {
    const response = await http.post({
      url: "/api/v1/products/upload-images",
      body: {
        fileName,
      },
    });
    return response.data;
  },
  uploadImage: async (presignedUrl: string, file: File) => {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
    return response;
  },
};