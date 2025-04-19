"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Stack,
  Textarea,
  Field,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuSave } from "react-icons/lu";

import { Supplier, SupplierFormData } from "@/types";
import { PREFECTURES } from "@/constants/prefectures";

interface SupplierEditFormProps {
  supplier: Supplier;
  onSubmit: (data: SupplierFormData) => void;
  isSubmitting: boolean;
}

export default function SupplierEditForm({
  supplier,
  onSubmit,
  isSubmitting,
}: SupplierEditFormProps) {
  // React Hook Formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SupplierFormData>();

  // フォームの初期値を設定
  useEffect(() => {
    if (supplier) {
      // フォームの初期値を設定
      Object.entries(supplier).forEach(([key, value]) => {
        if (key !== "id" && key !== "created_at" && key !== "updated_at") {
          setValue(key as keyof SupplierFormData, value as string);
        }
      });
    }
  }, [supplier, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Text mb={4} color="red.500" fontSize="sm">
        *は必須項目です
      </Text>
      <Stack gap={8}>
        {/* 基本情報セクション */}
        <Box>
          <Heading size="md" mb={4}>
            基本情報
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* 仕入先名 */}
            <Box>
              <Field.Root required invalid={!!errors.name}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  仕入先名
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="例: 株式会社サンプル"
                  {...register("name", {
                    required: "仕入先名は必須です",
                    maxLength: {
                      value: 200,
                      message: "仕入先名は200文字以内で入力してください",
                    },
                  })}
                />
                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
              </Field.Root>
            </Box>

            {/* 仕入先コード */}
            <Box>
              <Field.Root invalid={!!errors.supplier_code}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  仕入先コード
                </Field.Label>
                <Input
                  placeholder="例: SUP001"
                  {...register("supplier_code", {
                    maxLength: {
                      value: 50,
                      message: "仕入先コードは50文字以内で入力してください",
                    },
                  })}
                />
                <Field.ErrorText>
                  {errors.supplier_code?.message}
                </Field.ErrorText>
              </Field.Root>
            </Box>

            {/* 担当者 */}
            <Box>
              <Field.Root invalid={!!errors.contact_person}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  担当者
                </Field.Label>
                <Input
                  placeholder="例: 山田太郎"
                  {...register("contact_person", {
                    maxLength: {
                      value: 100,
                      message: "担当者名は100文字以内で入力してください",
                    },
                  })}
                />
                <Field.ErrorText>
                  {errors.contact_person?.message}
                </Field.ErrorText>
              </Field.Root>
            </Box>
            {/* 空の要素（スペース用） */}
            <Box></Box>

            {/* 電話番号 */}
            <Box>
              <Field.Root required invalid={!!errors.phone}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  電話番号
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="例: 03-1234-5678"
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
                />
                <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
              </Field.Root>
            </Box>

            {/* FAX */}
            <Box>
              <Field.Root invalid={!!errors.fax}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  FAX
                </Field.Label>
                <Input
                  placeholder="例: 03-1234-5678"
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
                />
                <Field.ErrorText>{errors.fax?.message}</Field.ErrorText>
              </Field.Root>
            </Box>

            {/* メールアドレス */}
            <Box>
              <Field.Root required invalid={!!errors.email}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  メールアドレス
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="例: info@example.com"
                  {...register("email", {
                    required: "メールアドレスは必須です",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "正しいメールアドレスの形式で入力してください",
                    },
                  })}
                />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>
            </Box>

            {/* ウェブサイト */}
            <Box>
              <Field.Root invalid={!!errors.website}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  ウェブサイト
                </Field.Label>
                <Input
                  placeholder="例: https://www.example.com"
                  {...register("website", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                      message: "正しいURLの形式で入力してください",
                    },
                  })}
                />
                <Field.ErrorText>{errors.website?.message}</Field.ErrorText>
              </Field.Root>
            </Box>
          </Grid>
        </Box>

        {/* 住所情報セクション */}
        <Box>
          <Heading size="md" mb={4}>
            住所情報
          </Heading>
          <Flex gap={10} flexWrap="wrap">
            {/* 郵便番号 */}
            <Box minW="200px">
              <Field.Root required invalid={!!errors.postal_code}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  郵便番号
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="例: 123-4567"
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
                />
                <Field.ErrorText>{errors.postal_code?.message}</Field.ErrorText>
              </Field.Root>
            </Box>

            {/* 都道府県 */}
            <Box minW="200px">
              <Field.Root required invalid={!!errors.prefecture}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  都道府県
                  <Field.RequiredIndicator />
                </Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    placeholder="選択してください"
                    {...register("prefecture", {
                      required: "都道府県は必須です",
                    })}
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
            </Box>

            {/* 市区町村 */}
            <Box minW="200px">
              <Field.Root required invalid={!!errors.city}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  市区町村
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="例: 渋谷区"
                  {...register("city", {
                    required: "市区町村は必須です",
                    maxLength: {
                      value: 100,
                      message: "市区町村は100文字以内で入力してください",
                    },
                  })}
                />
                <Field.ErrorText>{errors.city?.message}</Field.ErrorText>
              </Field.Root>
            </Box>

            {/* 町名・番地 */}
            <Box minW="200px">
              <Field.Root required invalid={!!errors.town}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  町名・番地
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="例: 渋谷1-2-3"
                  {...register("town", {
                    required: "町名・番地は必須です",
                    maxLength: {
                      value: 200,
                      message: "町名・番地は200文字以内で入力してください",
                    },
                  })}
                />
                <Field.ErrorText>{errors.town?.message}</Field.ErrorText>
              </Field.Root>
            </Box>

            {/* 建物名 */}
            <Box minW="200px">
              <Field.Root invalid={!!errors.building}>
                <Field.Label fontSize="sm" color="gray.500" mb={1}>
                  建物名
                </Field.Label>
                <Input
                  placeholder="例: 渋谷ビル101"
                  {...register("building", {
                    maxLength: {
                      value: 200,
                      message:
                        "建物名・部屋番号は200文字以内で入力してください",
                    },
                  })}
                />
                <Field.ErrorText>{errors.building?.message}</Field.ErrorText>
              </Field.Root>
            </Box>
          </Flex>
        </Box>

        {/* 備考セクション */}
        <Box>
          <Heading size="md" mb={4}>
            備考
          </Heading>
          <Field.Root invalid={!!errors.remarks}>
            <Field.Label fontSize="sm" color="gray.500" mb={1}>
              備考
            </Field.Label>
            <Textarea
              placeholder="備考があれば入力してください"
              rows={5}
              {...register("remarks", {
                maxLength: {
                  value: 2000,
                  message: "備考は2000文字以内で入力してください",
                },
              })}
            />
            <Field.ErrorText>{errors.remarks?.message}</Field.ErrorText>
          </Field.Root>
        </Box>

        {/* 保存ボタン */}
        <Flex justify="flex-end">
          <Button
            colorScheme="blue"
            type="submit"
            disabled={isSubmitting}
            ml="auto"
          >
            <LuSave style={{ marginRight: "8px" }} />
            保存
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
