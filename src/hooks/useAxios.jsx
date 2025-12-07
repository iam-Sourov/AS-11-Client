import axios from "axios";

const useAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});
export default useAxios;