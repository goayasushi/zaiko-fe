/**
 * 仕入先情報の型定義
 * APIから取得される仕入先データの形式
 */
export type Supplier = {
  id: number;
  supplier_code: string | null;
  name: string;
  contact_person: string;
  phone: string;
  fax: string;
  email: string;
  postal_code: string;
  prefecture: string;
  city: string;
  town: string;
  building: string;
  website: string;
  remarks: string;
  created_at?: string;
  updated_at?: string;
};

/**
 * 仕入先フォームの型定義
 * フォーム入力用の型
 */
export type SupplierFormData = Omit<
  Supplier,
  "id" | "created_at" | "updated_at"
>;
