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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { SupplierFormData } from "@/types";
import axiosClient from "@/lib/axiosClient";
import { PREFECTURES } from "@/constants/prefectures";

export default function NewSupplierPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>();

  // APIを使用した仕入先登録処理
  const fetchCreateSupplier = async (data: SupplierFormData) => {
    const { data: response } = await axiosClient.post(
      "/api/masters/suppliers/",
      data
    );
    console.log(response);
    return response;
  };

  // React Queryのmutation
  const createSupplier = useMutation({
    mutationFn: fetchCreateSupplier,
    onSuccess: () => {
      // 仕入先一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });

      // 成功したら一覧ページに戻る
      router.push("/partner/supplier");
    },
    onError: (error) => {
      console.error("エラー:", error);
      alert("保存に失敗しました");
    },
  });

  // フォーム送信処理
  const onSubmit = (data: SupplierFormData) => {
    console.log(data);
    createSupplier.mutate(data);
  };

  // キャンセルボタンの処理
  const handleCancel = () => {
    router.back();
  };

  return (
    <Box>
      <Heading as="h1" mb={6}>
        仕入先登録
      </Heading>

      <Text mb={4} color="red.500" fontSize="sm">
        *は必須項目です
      </Text>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={6} maxW="800px">
          {/* 仕入先名 */}
          <Field.Root invalid={!!errors.name} required>
            <Field.Label>
              仕入先名
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              {...register("name", {
                required: "仕入先名は必須です",
                maxLength: {
                  value: 200,
                  message: "仕入先名は200文字以内で入力してください",
                },
              })}
              placeholder="仕入先名を入力"
            />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          {/* 仕入先コード */}
          <Field.Root invalid={!!errors.supplier_code}>
            <Field.Label>仕入先コード</Field.Label>
            <Input
              {...register("supplier_code", {
                maxLength: {
                  value: 50,
                  message: "仕入先コードは50文字以内で入力してください",
                },
              })}
              placeholder="仕入先コードを入力"
            />
            <Field.ErrorText>{errors.supplier_code?.message}</Field.ErrorText>
          </Field.Root>

          {/* 郵便番号 */}
          <Field.Root invalid={!!errors.postal_code} required>
            <Field.Label>
              郵便番号
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              {...register("postal_code", {
                required: "郵便番号は必須です",
                maxLength: {
                  value: 10,
                  message: "郵便番号は10文字以内で入力してください",
                },
                pattern: {
                  value: /^\d{3}-?\d{4}$/,
                  message:
                    "正しい郵便番号の形式で入力してください（例: 123-4567）",
                },
              })}
              placeholder="例: 123-4567"
            />
            <Field.ErrorText>{errors.postal_code?.message}</Field.ErrorText>
          </Field.Root>

          {/* 住所1 */}
          <Field.Root invalid={!!errors.prefecture} required>
            <Field.Label>
              都道府県
              <Field.RequiredIndicator />
            </Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                {...register("prefecture", {
                  required: "都道府県は必須です",
                })}
                placeholder="都道府県を選択"
              >
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText>{errors.prefecture?.message}</Field.ErrorText>
          </Field.Root>

          {/* 住所2 */}
          <Field.Root invalid={!!errors.city} required>
            <Field.Label>
              市区町村
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              {...register("city", {
                required: "市区町村は必須です",
                maxLength: {
                  value: 100,
                  message: "市区町村は100文字以内で入力してください",
                },
              })}
              placeholder="市区町村を入力"
            />
            <Field.ErrorText>{errors.city?.message}</Field.ErrorText>
          </Field.Root>

          {/* 住所3 */}
          <Field.Root invalid={!!errors.town} required>
            <Field.Label>
              町名・番地
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              {...register("town", {
                required: "町名・番地は必須です",
                maxLength: {
                  value: 200,
                  message: "町名・番地は200文字以内で入力してください",
                },
              })}
              placeholder="町名・番地を入力"
            />
            <Field.ErrorText>{errors.town?.message}</Field.ErrorText>
          </Field.Root>

          {/* 住所4 */}
          <Field.Root invalid={!!errors.building}>
            <Field.Label>建物名・部屋番号</Field.Label>
            <Input
              {...register("building", {
                maxLength: {
                  value: 200,
                  message: "建物名・部屋番号は200文字以内で入力してください",
                },
              })}
              placeholder="建物名・部屋番号を入力"
            />
            <Field.ErrorText>{errors.building?.message}</Field.ErrorText>
          </Field.Root>

          {/* 電話番号 */}
          <Field.Root invalid={!!errors.phone} required>
            <Field.Label>
              電話番号
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              {...register("phone", {
                required: "電話番号は必須です",
                maxLength: {
                  value: 50,
                  message: "電話番号は50文字以内で入力してください",
                },
                pattern: {
                  value: /^[0-9\-\(\)]+$/,
                  message: "正しい電話番号の形式で入力してください",
                },
              })}
              placeholder="例: 03-1234-5678"
            />
            <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
          </Field.Root>

          {/* FAX番号 */}
          <Field.Root invalid={!!errors.fax}>
            <Field.Label>FAX番号</Field.Label>
            <Input
              {...register("fax", {
                maxLength: {
                  value: 50,
                  message: "FAX番号は50文字以内で入力してください",
                },
                pattern: {
                  value: /^[0-9\-\(\)]+$/,
                  message: "正しいFAX番号の形式で入力してください",
                },
              })}
              placeholder="例: 03-1234-5678"
            />
            <Field.ErrorText>{errors.fax?.message}</Field.ErrorText>
          </Field.Root>

          {/* メールアドレス */}
          <Field.Root invalid={!!errors.email} required>
            <Field.Label>
              メールアドレス
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              {...register("email", {
                required: "メールアドレスは必須です",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "正しいメールアドレスの形式で入力してください",
                },
              })}
              placeholder="例: example@email.com"
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          {/* 担当者名 */}
          <Field.Root invalid={!!errors.contact_person}>
            <Field.Label>担当者名</Field.Label>
            <Input
              {...register("contact_person", {
                maxLength: {
                  value: 100,
                  message: "担当者名は100文字以内で入力してください",
                },
              })}
              placeholder="担当者名を入力"
            />
            <Field.ErrorText>{errors.contact_person?.message}</Field.ErrorText>
          </Field.Root>

          {/* Webサイト */}
          <Field.Root invalid={!!errors.website}>
            <Field.Label>Webサイト</Field.Label>
            <Input
              {...register("website", {
                pattern: {
                  value:
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                  message: "正しいURLの形式で入力してください",
                },
              })}
              placeholder="例: https://example.com"
            />
            <Field.ErrorText>{errors.website?.message}</Field.ErrorText>
          </Field.Root>

          {/* 備考 */}
          <Field.Root invalid={!!errors.remarks}>
            <Field.Label>備考</Field.Label>
            <Textarea
              {...register("remarks", {
                maxLength: {
                  value: 2000,
                  message: "備考は2000文字以内で入力してください",
                },
              })}
              placeholder="備考を入力"
              rows={4}
            />
            <Field.ErrorText>{errors.remarks?.message}</Field.ErrorText>
          </Field.Root>

          {/* 送信ボタン */}
          <Flex justifyContent="center" gap={4} mt={6}>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createSupplier.isPending}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              loading={createSupplier.isPending}
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
