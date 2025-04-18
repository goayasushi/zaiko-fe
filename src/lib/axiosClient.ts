"use client";

import axios, { AxiosInstance } from "axios";

// axiosインスタンスの作成
const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// リクエスト時に自動的にJWTトークンを付与
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンス時に新しいJWTトークンを取得, 401エラー時にエラー画面へリダイレクト
axiosClient.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-access-token"];
    if (newToken) {
      localStorage.setItem("access_token", newToken);
    }
    return response;
  },
  (error) => {
    // jwtトークンエラーの場合はエラー画面へリダイレクト
    if (
      error.response?.status === 401 &&
      error.response?.data.code === "token_not_valid"
    ) {
      window.location.href = "/error-auth";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
