import axios from "axios";

const API_URL = "https://my-media-backend.vercel.app/api/media"

// Attach token
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // ✅ must match how you store it at login
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const mediaService = {
  // ✅ FETCH MEDIA (paginated)
  getMedia: async (params: any) => {
    const response = await axios.get(API_URL, { params, ...getAuthHeader() });
    return response.data;
  },

  // ✅ ADD MEDIA (supports file upload)
 createMedia: async (data: FormData) => {
  const response = await axios.post(API_URL, data, getAuthHeader());
  return response.data;
},

  // ✅ UPDATE MEDIA (supports file upload)
  updateMedia: async (id: number, data: FormData) => {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    return response.data;
  },

  // ✅ DELETE MEDIA
  deleteMedia: async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  },
};
