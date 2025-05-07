import { User } from "./user";
import { SupplierSimple } from "./supplier";

/**
 * 部品情報の型定義
 * APIから取得される部品データの形式
 */
export type Part = {
  id: number;
  name: string;
  category: string;
  supplier: SupplierSimple;
  cost_price: string;
  selling_price: string;
  tax_rate: string;
  stock_quantity: number;
  reorder_level: number;
  description: string;
  image: string | null;
  created_by?: User;
  updated_by?: User;
  created_at?: string;
  updated_at?: string;
};

/**
 * 部品フォームの型定義
 * フォーム入力用の型
 */
export type PartFormData = {
  name: string;
  category: string;
  supplier_id: number;
  cost_price: string | number;
  selling_price: string | number;
  tax_rate?: number;
  stock_quantity: number;
  reorder_level: number;
  description?: string;
  image_file?: File;
};

/**
 * 部品一覧レスポンスの型定義
 * APIからのレスポンス形式
 */
export type PartResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Part[];
  page_size: number;
  current: number;
  total_pages: number;
};
