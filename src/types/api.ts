import { Supplier } from "./supplier";

/**
 * ページネーション付きAPIレスポンスの共通型
 * T: 結果配列の要素の型
 */
export interface PaginationResponse<T> {
  /** 総アイテム数 */
  count: number;
  /** 総ページ数 */
  total_pages: number;
  /** 現在のページ番号 */
  current: number;
  /** 1ページあたりのアイテム数 */
  page_size: number;
  /** 次のページのURL (最後のページではnull) */
  next: string | null;
  /** 前のページのURL (最初のページではnull) */
  previous: string | null;
  /** 結果の配列 */
  results: T[];
}

/**
 * 仕入先一覧APIレスポンスの型
 */
export type SupplierResponse = PaginationResponse<Supplier>;
