/**
 * ユーザー情報の型定義
 * APIから取得されるユーザーデータの形式
 */
export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
};

/**
 * ログインフォームの型定義
 */
export type LoginFormData = {
  email: string;
  password: string;
};

/**
 * ログインAPIのレスポンス型定義
 */
export type LoginResponse = {
  access: string;
  refresh?: string;
};
