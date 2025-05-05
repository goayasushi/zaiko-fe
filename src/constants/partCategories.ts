/**
 * 部品カテゴリ一覧
 * 部品のカテゴリを選択肢として提供します
 */
export const PART_CATEGORIES = ["head", "shaft", "grip", "other"];

/**
 * 部品カテゴリ名のマッピング
 * APIに送信する値と表示用の日本語ラベルのマッピング
 */
export const PART_CATEGORY_LABELS: Record<string, string> = {
  head: "ヘッド",
  shaft: "シャフト",
  grip: "グリップ",
  other: "その他",
};
