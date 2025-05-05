/**
 * 部品情報の型定義
 * APIから取得される部品データの形式
 */
export type Part = {
  id: number;
  name: string;
  category: string;
  supplier_id: number;
  supplier_name?: string;
  cost_price: number;
  selling_price: number;
  tax_rate: number;
  stock_quantity: number;
  reorder_level: number;
  description: string;
  image: string | null;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
};

/**
 * 部品フォームの型定義
 * フォーム入力用の型
 */
export type PartFormData = Omit<
  Part,
  | "id"
  | "created_at"
  | "updated_at"
  | "created_by"
  | "updated_by"
  | "supplier_name"
> & {
  image_file?: File;
};
