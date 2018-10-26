import axios from "axios";

const URL = "http://localhost:3001/";

const AXIOS = axios.create({
  baseURL: URL,
  timeout: 30000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  }
});

export default AXIOS;
