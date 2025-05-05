"use client";

import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Input,
  Text,
  Field,
  Textarea,
  NativeSelect,
  Image,
  NumberInput,
} from "@chakra-ui/react";
import { FileUpload, useFileUpload } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { HiUpload } from "react-icons/hi";

import { PartFormData, Supplier, SupplierResponse } from "@/types";
import axiosClient from "@/lib/axiosClient";
import {
  PART_CATEGORIES,
  PART_CATEGORY_LABELS,
} from "@/constants/partCategories";

// 仕入先データを取得する関数
const fetchSuppliers = async (): Promise<Supplier[]> => {
  const { data } = await axiosClient.get<SupplierResponse>(
    "/api/masters/suppliers/"
  );
  return data.results;
};

export default function NewPartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // FileUploadフックの設定
  const upload = useFileUpload({
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 2, // 2MB
    accept: ["image/jpeg", "image/png"],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PartFormData>({
    defaultValues: {
      stock_quantity: 0,
      reorder_level: 0,
    },
  });

  // 仕入先データの取得
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  // APIを使用した部品登録処理
  const fetchCreatePart = async (data: PartFormData) => {
    // FormDataオブジェクトを作成
    const formData = new FormData();

    // 通常のフィールドを追加
    Object.entries(data).forEach(([key, value]) => {
      // image_fileは別途処理するためスキップ
      if (key !== "image_file" && value !== undefined && value !== null) {
        // tax_rateの場合は100倍にして送信
        if (key === "tax_rate") {
          formData.append(key, String(Number(value) * 100));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // 画像ファイルがある場合は追加
    if (upload.acceptedFiles[0]) {
      formData.append("image", upload.acceptedFiles[0]);
    }

    const { data: response } = await axiosClient.post(
      "/api/masters/parts/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  };

  // React Queryのmutation
  const createPart = useMutation({
    mutationFn: fetchCreatePart,
    onSuccess: () => {
      // 部品一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["parts"] });

      // 成功したら一覧ページに戻る
      router.push("/part");
    },
    onError: (error) => {
      console.error("エラー:", error);
    },
  });

  // フォーム送信処理
  const onSubmit = (data: PartFormData) => {
    createPart.mutate(data);
  };

  // キャンセルボタンの処理
  const handleCancel = () => {
    router.back();
  };

  return (
    <Box>
      <Heading as="h1" mb={6}>
        部品登録
      </Heading>

      <Text mb={4} color="red.500" fontSize="sm">
        *は必須項目です
      </Text>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={6} maxW="800px">
          {/* 部品名 */}
          <Field.Root invalid={!!errors.name} required>
            <Field.Label>
              部品名
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              {...register("name", {
                required: "部品名は必須です",
                maxLength: {
                  value: 200,
                  message: "部品名は200文字以内で入力してください",
                },
              })}
              placeholder="部品名を入力"
            />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          {/* カテゴリ */}
          <Field.Root invalid={!!errors.category} required>
            <Field.Label>
              カテゴリ
              <Field.RequiredIndicator />
            </Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                {...register("category", {
                  required: "カテゴリは必須です",
                })}
                placeholder="カテゴリを選択"
              >
                {PART_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {PART_CATEGORY_LABELS[category]}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText>{errors.category?.message}</Field.ErrorText>
          </Field.Root>

          {/* 仕入先 */}
          <Field.Root invalid={!!errors.supplier_id} required>
            <Field.Label>
              仕入先
              <Field.RequiredIndicator />
            </Field.Label>
            <NativeSelect.Root disabled={suppliersLoading}>
              <NativeSelect.Field
                {...register("supplier_id", {
                  required: "仕入先は必須です",
                })}
                placeholder="仕入先を選択"
              >
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText>{errors.supplier_id?.message}</Field.ErrorText>
          </Field.Root>

          {/* 原価 */}
          <Field.Root invalid={!!errors.cost_price} required>
            <Field.Label>
              原価
              <Field.RequiredIndicator />
            </Field.Label>
            <Controller
              name="cost_price"
              control={control}
              rules={{
                required: "原価は必須です",
                min: { value: 0, message: "0以上の数値を入力してください" },
              }}
              render={({ field }) => (
                <NumberInput.Root
                  min={0}
                  onValueChange={(value) => field.onChange(value.valueAsNumber)}
                  formatOptions={{
                    style: "currency",
                    currency: "JPY",
                  }}
                >
                  <NumberInput.Control />
                  <NumberInput.Input placeholder="1000" onBlur={field.onBlur} />
                </NumberInput.Root>
              )}
            />
            <Field.ErrorText>{errors.cost_price?.message}</Field.ErrorText>
          </Field.Root>

          {/* 見積用単価 */}
          <Field.Root invalid={!!errors.selling_price} required>
            <Field.Label>
              見積用単価
              <Field.RequiredIndicator />
            </Field.Label>
            <Controller
              name="selling_price"
              control={control}
              rules={{
                required: "見積用単価は必須です",
                min: { value: 0, message: "0以上の数値を入力してください" },
              }}
              render={({ field }) => (
                <NumberInput.Root
                  min={0}
                  onValueChange={(value) => field.onChange(value.valueAsNumber)}
                  formatOptions={{
                    style: "currency",
                    currency: "JPY",
                  }}
                >
                  <NumberInput.Control />
                  <NumberInput.Input placeholder="2000" onBlur={field.onBlur} />
                </NumberInput.Root>
              )}
            />
            <Field.ErrorText>{errors.selling_price?.message}</Field.ErrorText>
          </Field.Root>

          {/* 税率 */}
          <Field.Root invalid={!!errors.tax_rate}>
            <Field.Label>税率</Field.Label>
            <Controller
              name="tax_rate"
              control={control}
              defaultValue={0.1}
              rules={{
                min: { value: 0, message: "0以上の数値を入力してください" },
                max: { value: 1, message: "100以下の数値を入力してください" },
              }}
              render={({ field }) => (
                <NumberInput.Root
                  min={0}
                  max={1}
                  step={0.01}
                  defaultValue={String(field.value * 100)}
                  onValueChange={(value) => field.onChange(value.valueAsNumber)}
                  formatOptions={{
                    style: "percent",
                  }}
                >
                  <NumberInput.Control />
                  <NumberInput.Input placeholder="10" onBlur={field.onBlur} />
                </NumberInput.Root>
              )}
            />
            <Field.ErrorText>{errors.tax_rate?.message}</Field.ErrorText>
          </Field.Root>

          {/* 現在庫数 */}
          <Field.Root invalid={!!errors.stock_quantity}>
            <Field.Label>現在庫数</Field.Label>
            <Controller
              name="stock_quantity"
              control={control}
              rules={{
                min: { value: 0, message: "0以上の整数を入力してください" },
              }}
              render={({ field }) => (
                <NumberInput.Root
                  min={0}
                  onValueChange={(value) => field.onChange(value.valueAsNumber)}
                  formatOptions={{
                    style: "decimal",
                  }}
                >
                  <NumberInput.Control />
                  <NumberInput.Input placeholder="100" onBlur={field.onBlur} />
                </NumberInput.Root>
              )}
            />
            <Field.ErrorText>{errors.stock_quantity?.message}</Field.ErrorText>
          </Field.Root>

          {/* 補充閾値 */}
          <Field.Root invalid={!!errors.reorder_level}>
            <Field.Label>補充閾値</Field.Label>
            <Controller
              name="reorder_level"
              control={control}
              rules={{
                min: { value: 0, message: "0以上の整数を入力してください" },
              }}
              render={({ field }) => (
                <NumberInput.Root
                  min={0}
                  onValueChange={(value) => field.onChange(value.valueAsNumber)}
                  formatOptions={{
                    style: "decimal",
                  }}
                >
                  <NumberInput.Control />
                  <NumberInput.Input placeholder="50" onBlur={field.onBlur} />
                </NumberInput.Root>
              )}
            />
            <Field.ErrorText>{errors.reorder_level?.message}</Field.ErrorText>
          </Field.Root>

          {/* 画像アップロード */}
          <Field.Root>
            <Field.Label>部品画像</Field.Label>
            <FileUpload.RootProvider value={upload}>
              <Stack gap={4}>
                <FileUpload.HiddenInput />

                <FileUpload.Trigger asChild>
                  <Button variant="outline" size="sm" width="fit-content">
                    <HiUpload />
                    <Text ml={2}>画像を選択</Text>
                  </Button>
                </FileUpload.Trigger>

                {/* プレビュー */}
                {upload.acceptedFiles.length > 0 && (
                  <Flex mt={2} direction="column" gap={2}>
                    <Text fontSize="sm">
                      {upload.acceptedFiles[0].name} (
                      {Math.round(upload.acceptedFiles[0].size / 1024)}KB)
                    </Text>
                    <Image
                      src={URL.createObjectURL(upload.acceptedFiles[0])}
                      alt="部品画像プレビュー"
                      maxWidth="200px"
                      maxHeight="200px"
                      objectFit="contain"
                      borderRadius="md"
                    />
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => upload.clearFiles()}
                      width="fit-content"
                    >
                      削除
                    </Button>
                  </Flex>
                )}

                {/* エラー表示 */}
                {upload.rejectedFiles.map((rejection) => (
                  <Text key={rejection.file.name} color="red.500" fontSize="sm">
                    {rejection.file.name}:{" "}
                    {rejection.errors[0] && rejection.errors[0]}
                  </Text>
                ))}
              </Stack>
            </FileUpload.RootProvider>
          </Field.Root>

          {/* 備考 */}
          <Field.Root invalid={!!errors.description}>
            <Field.Label>備考</Field.Label>
            <Textarea
              {...register("description", {
                maxLength: {
                  value: 2000,
                  message: "備考は2000文字以内で入力してください",
                },
              })}
              placeholder="備考を入力"
              rows={4}
            />
            <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
          </Field.Root>

          {/* 送信ボタン */}
          <Flex justifyContent="center" gap={4} mt={6}>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createPart.isPending}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              loading={createPart.isPending}
              loadingText="保存中"
            >
              保存
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
}
