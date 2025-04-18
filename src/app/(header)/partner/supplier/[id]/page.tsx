"use client";

import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Stack,
  Text,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuArrowLeft, LuPencil, LuX, LuTrash2 } from "react-icons/lu";

import { Supplier, SupplierFormData } from "@/types";
import axiosClient from "@/lib/axiosClient";
import SupplierEditForm from "./SupplierEditForm";

// 仕入先詳細データを取得する関数
const fetchSupplierDetail = async (id: string): Promise<Supplier> => {
  const { data } = await axiosClient.get<Supplier>(
    `/api/masters/suppliers/${id}/`
  );
  return data;
};

// 仕入先を更新する関数
const updateSupplier = async (
  id: string,
  formData: SupplierFormData
): Promise<Supplier> => {
  const { data } = await axiosClient.put<Supplier>(
    `/api/masters/suppliers/${id}/`,
    formData
  );
  return data;
};

// 仕入先を削除する関数
const deleteSupplier = async (id: string): Promise<void> => {
  await axiosClient.delete(`/api/masters/suppliers/${id}/`);
};

// 詳細情報の項目コンポーネント
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <Box>
    <Text fontSize="sm" color="gray.500" mb={1}>
      {label}
    </Text>
    <Text>{value || "未設定"}</Text>
  </Box>
);

export default function SupplierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const supplierId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);

  // 仕入先詳細データの取得
  const {
    data: supplier,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["supplier", supplierId],
    queryFn: () => fetchSupplierDetail(supplierId),
  });

  // 更新ミューテーション
  const updateMutation = useMutation({
    mutationFn: (data: SupplierFormData) => updateSupplier(supplierId, data),
    onSuccess: () => {
      // キャッシュの無効化
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["supplier", supplierId] });

      // 編集モードを終了
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("更新エラー:", error);
    },
  });

  // 削除ミューテーション
  const deleteMutation = useMutation({
    mutationFn: () => deleteSupplier(supplierId),
    onSuccess: () => {
      // キャッシュの無効化
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });

      // 一覧ページへリダイレクト
      router.push("/partner/supplier");
    },
    onError: (error) => {
      console.error("削除エラー:", error);
    },
  });

  // 編集モードの切り替え
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // フォーム送信ハンドラー
  const handleSubmit = (data: SupplierFormData) => {
    updateMutation.mutate(data);
  };

  // 削除実行ハンドラー
  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return <Text>読み込み中...</Text>;
  }

  if (isError) {
    return (
      <Box>
        <Text color="red.500">データの取得に失敗しました。</Text>
        <Button mt={4} onClick={() => router.push("/partner/supplier")}>
          仕入先一覧に戻る
        </Button>
      </Box>
    );
  }

  if (!supplier) {
    return (
      <Box>
        <Text>仕入先が見つかりません</Text>
        <Button mt={4} onClick={() => router.push("/partner/supplier")}>
          仕入先一覧に戻る
        </Button>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      <Stack gap={6}>
        {/* ヘッダー */}
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <IconButton
              aria-label="戻る"
              variant="ghost"
              mr={2}
              onClick={() => router.push("/partner/supplier")}
            >
              <LuArrowLeft />
            </IconButton>
            <Heading size="lg">仕入先詳細</Heading>
          </Flex>
          {!isEditing ? (
            <Flex gap={2}>
              <Button onClick={toggleEditMode}>
                <LuPencil style={{ marginRight: "8px" }} />
                編集
              </Button>
              <Dialog.Root role="alertdialog">
                <Dialog.Trigger asChild>
                  <Button variant="outline">
                    <LuTrash2 style={{ marginRight: "8px" }} />
                    削除
                  </Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title>削除しますか?</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        「{supplier.name}」を削除してもよろしいですか？
                        この操作は取り消せません。
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">キャンセル</Button>
                        </Dialog.ActionTrigger>
                        <Button
                          colorPalette="red"
                          onClick={handleDelete}
                          disabled={deleteMutation.isPending}
                        >
                          削除する
                        </Button>
                      </Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Dialog.CloseTrigger>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </Flex>
          ) : (
            <Flex gap={2}>
              <Button
                variant="outline"
                onClick={toggleEditMode}
                disabled={updateMutation.isPending}
              >
                <LuX style={{ marginRight: "8px" }} />
                キャンセル
              </Button>
            </Flex>
          )}
        </Flex>

        {/* 詳細情報 / 編集フォーム */}
        <Card.Root>
          <Card.Body p={6}>
            {isEditing ? (
              // 編集モード - 別コンポーネントとして分離
              <SupplierEditForm
                supplier={supplier}
                onSubmit={handleSubmit}
                isSubmitting={updateMutation.isPending}
              />
            ) : (
              // 表示モード
              <Stack gap={8}>
                {/* 基本情報セクション */}
                <Box>
                  <Heading size="md" mb={4}>
                    基本情報
                  </Heading>
                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <DetailItem label="仕入先名" value={supplier.name} />
                    <DetailItem
                      label="仕入先コード"
                      value={supplier.supplier_code}
                    />
                    <GridItem colSpan={2}>
                      <DetailItem
                        label="担当者"
                        value={supplier.contact_person}
                      />
                    </GridItem>
                    <DetailItem label="電話番号" value={supplier.phone} />
                    <DetailItem label="FAX" value={supplier.fax} />
                    <DetailItem label="メールアドレス" value={supplier.email} />
                    <DetailItem label="ウェブサイト" value={supplier.website} />
                  </Grid>
                </Box>

                {/* 住所情報セクション */}
                <Box>
                  <Heading size="md" mb={4}>
                    住所情報
                  </Heading>
                  <Flex justify="flex-start" gap={10} flexWrap="wrap">
                    <DetailItem label="郵便番号" value={supplier.postal_code} />
                    <DetailItem label="都道府県" value={supplier.prefecture} />
                    <DetailItem label="市区町村" value={supplier.city} />
                    <DetailItem label="町名・番地" value={supplier.town} />
                    <DetailItem label="建物名" value={supplier.building} />
                  </Flex>
                </Box>

                {/* 備考セクション */}
                {supplier.remarks && (
                  <Box>
                    <Heading size="md" mb={4}>
                      備考
                    </Heading>
                    <Text whiteSpace="pre-wrap">{supplier.remarks}</Text>
                  </Box>
                )}
              </Stack>
            )}
          </Card.Body>
        </Card.Root>
      </Stack>
    </Container>
  );
}
