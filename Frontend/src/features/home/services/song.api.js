import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/songs",
  withCredentials: true,
});

export const getSong = async ({ mood }) => {
  const response = await api.get("?mood=" + mood);
  console.log(response);

  return response.data;
};
