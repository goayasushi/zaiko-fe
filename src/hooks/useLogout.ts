import { useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";

export const useLogout = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const logout = () => {
    // ローカルストレージのアクセストークンを削除
    localStorage.removeItem("access_token");

    // グローバルで管理しているユーザー情報をリセット
    setUser(null);

    router.push("/login");
  };

  return { logout };
};
