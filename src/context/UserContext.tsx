"use client";

import { createContext, useContext } from "react";
import axiosClient from "@/lib/axiosClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

// ユーザー情報の型定義
type User = {
  username: string;
  email: string;
  groups: string[];
};

// Contextで管理するデータ型
type UserContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
};

// Contextの初期化
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

// UserProvider: ユーザー情報を取得して全体に提供する
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const fetchUser = async (): Promise<User | null> => {
    try {
      const res = await axiosClient.get<User>("/account/auth-user/");
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (
        error.response?.status === 400 &&
        error.response.data?.message === "user not authenticated"
      ) {
        return null;
      }
      throw error;
    }
  };

  const { data: user, isLoading } = useQuery<User | null, AxiosError>({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    retry: false,
    initialData: null,
  });

  // queryClient.setQueryData()でuserを更新
  const setUser = (newUser: User | null) => {
    if (newUser === null) {
      // ログアウト時にキャッシュを無効化
      queryClient.setQueryData(["authUser"], null);
    } else {
      // ユーザー情報を更新
      queryClient.setQueryData(["authUser"], newUser);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading: isLoading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// useUser: Contextの値を取得するカスタムフック
export const useUser = () => useContext(UserContext);
