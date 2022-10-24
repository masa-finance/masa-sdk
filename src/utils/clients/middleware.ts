import axios from "axios";
import { config } from "./config";

const headers = {
  "Content-Type": "application/json",
};

export const middlewareClient = axios.create({
  baseURL: config.get("api-url") as string,
  withCredentials: true,
  headers,
});
