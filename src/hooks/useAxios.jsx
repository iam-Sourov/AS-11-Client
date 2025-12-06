import axios from "axios";

const useAxios = axios.create({
  baseURL: "http://localhost:5000", // your base URL
});
export default useAxios;