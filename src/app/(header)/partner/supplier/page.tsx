"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  Card,
  Table,
  Dialog,
  Portal,
  CloseButton,
  Checkbox,
  ActionBar,
} from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Supplier, SupplierResponse } from "@/types";
import axiosClient from "@/lib/axiosClient";

// 仕入先データを取得する関数
const fetchSuppliers = async (url: string): Promise<SupplierResponse> => {
  const { data } = await axiosClient.get<SupplierResponse>(url);
  return data;
};

// 複数の仕入先を削除する関数
const deleteMultipleSuppliers = async (ids: number[]): Promise<void> => {
  await axiosClient.post(`/api/masters/suppliers/bulk-delete/`, { ids });
};

export default function SupplierListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // APIのURLを状態として管理
  const [apiUrl, setApiUrl] = useState("/api/masters/suppliers/");
  // 選択された仕入先のIDを管理
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const hasSelection = selectedIds.length > 0;

  // React Queryを使用してデータを取得
  const {
    data: suppliers,
    isLoading,
    isError,
  } = useQuery<SupplierResponse>({
    queryKey: ["suppliers", apiUrl],
    queryFn: () => fetchSuppliers(apiUrl),
    placeholderData: (previousData) => previousData,
  });

  // 複数削除のミューテーション
  const deleteMultipleMutation = useMutation({
    mutationFn: deleteMultipleSuppliers,
    onSuccess: () => {
      // 現在のページのすべてのアイテムが削除されたかチェック
      const allCurrentPageItemsDeleted =
        suppliers &&
        suppliers.results.length > 0 &&
        suppliers.results.every((supplier) =>
          selectedIds.includes(supplier.id)
        );

      // 全アイテム削除かつ最初のページではない場合は前のページに戻る
      if (allCurrentPageItemsDeleted && suppliers && suppliers.current > 1) {
        if (suppliers.previous) {
          // 前のページに移動
          setApiUrl(suppliers.previous);
        } else {
          // 最初のページに戻る
          const baseUrl = apiUrl.split("?")[0];
          setApiUrl(baseUrl);
        }
      }

      // 選択をクリア
      setSelectedIds([]);

      // 少し遅延してからキャッシュを無効化
      // これにより新しいURLでの再取得が適切に行われる
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      }, 100);
    },
    onError: (error) => {
      console.error("削除エラー:", error);
    },
  });

  // ページネーションハンドラー
  const handlePrevPage = () => {
    if (suppliers?.previous) {
      setApiUrl(suppliers.previous);
      setSelectedIds([]); // ページ切り替え時に選択をクリア
    }
  };

  const handleNextPage = () => {
    if (suppliers?.next) {
      setApiUrl(suppliers.next);
      setSelectedIds([]); // ページ切り替え時に選択をクリア
    }
  };

  // チェックボックスの選択ハンドラー
  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  // 全選択/全解除ハンドラー
  const handleSelectAll = (isChecked: boolean) => {
    setSelectedIds(
      isChecked ? suppliers!.results.map((supplier) => supplier.id) : []
    );
  };

  // 複数削除ハンドラー
  const handleDeleteMultiple = () => {
    if (selectedIds.length > 0) {
      deleteMultipleMutation.mutate(selectedIds);
    }
  };

  // 行クリックハンドラー - チェックボックスクリック時は詳細ページに遷移させない
  const handleRowClick = (supplierId: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName !== "INPUT") {
      router.push(`/partner/supplier/${supplierId}`);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">
          仕入先
        </Heading>
        <Stack direction="row" gap={2}>
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => router.push("/partner/supplier/new")}
          >
            <LuPlus style={{ marginRight: "8px" }} />
            新しい取引先を追加
          </Button>
        </Stack>
      </Flex>

      {isLoading ? (
        <Text>読み込み中...</Text>
      ) : isError ? (
        <Text color="red.500">エラーが発生しました。再度お試しください。</Text>
      ) : suppliers ? (
        <>
          <Card.Root>
            <Box overflowX="auto">
              <Table.Root interactive variant="outline" showColumnBorder>
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.Cell width="40px">
                      <Checkbox.Root
                        checked={
                          hasSelection &&
                          selectedIds.length < suppliers.results.length
                            ? "indeterminate"
                            : selectedIds.length > 0
                        }
                        onCheckedChange={(change) => {
                          const isChecked = change?.checked === true;
                          handleSelectAll(isChecked);
                        }}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Table.Cell>
                    <Table.Cell fontWeight="bold">仕入先名</Table.Cell>
                    <Table.Cell fontWeight="bold">仕入先コード</Table.Cell>
                    <Table.Cell fontWeight="bold">住所</Table.Cell>
                    <Table.Cell fontWeight="bold">電話番号</Table.Cell>
                    <Table.Cell fontWeight="bold">メールアドレス</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {suppliers.results.map((supplier: Supplier) => (
                    <Table.Row
                      key={supplier.id}
                      onClick={(e) => handleRowClick(supplier.id, e)}
                      cursor="pointer"
                    >
                      <Table.Cell onClick={(e) => e.stopPropagation()}>
                        <Checkbox.Root
                          checked={selectedIds.includes(supplier.id)}
                          onCheckedChange={(change) => {
                            const isChecked = change?.checked === true;
                            handleCheckboxChange(supplier.id, isChecked);
                          }}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      </Table.Cell>
                      <Table.Cell>{supplier.name}</Table.Cell>
                      <Table.Cell>{supplier.supplier_code}</Table.Cell>
                      <Table.Cell>{`${supplier.prefecture}${supplier.city}`}</Table.Cell>
                      <Table.Cell>{supplier.phone}</Table.Cell>
                      <Table.Cell>{supplier.email}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card.Root>

          <Flex
            mt={4}
            justify="space-between"
            align="center"
            fontSize="sm"
            color="gray.600"
          >
            <Flex align="center" gap={1}>
              <Button
                size="sm"
                variant="ghost"
                disabled={!suppliers.previous}
                onClick={handlePrevPage}
              >
                <Icon as={HiChevronLeft} />
              </Button>
              <Text>
                {suppliers.current} / {suppliers.total_pages}
              </Text>
              <Button
                size="sm"
                variant="ghost"
                disabled={!suppliers.next}
                onClick={handleNextPage}
              >
                <Icon as={HiChevronRight} />
              </Button>
            </Flex>

            <Flex align="center" gap={2}>
              <Text>
                {suppliers.page_size}件/ページ 全{suppliers.count || 0}件
              </Text>
            </Flex>
          </Flex>
        </>
      ) : null}

      {/* ActionBar for bulk actions */}
      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selectedIds.length}件選択中
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button variant="surface" size="sm" colorPalette="red">
                    <LuTrash2 />
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
                        選択した{selectedIds.length}
                        件の仕入先を削除してもよろしいですか？
                        この操作は取り消せません。
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">キャンセル</Button>
                        </Dialog.ActionTrigger>
                        <Button
                          colorPalette="red"
                          onClick={handleDeleteMultiple}
                          disabled={deleteMultipleMutation.isPending}
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
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </Box>
  );
}
