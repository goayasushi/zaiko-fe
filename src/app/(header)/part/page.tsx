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
  Checkbox,
} from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { LuPlus } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Part, PartResponse } from "@/types";
import axiosClient from "@/lib/axiosClient";
import { PART_CATEGORY_LABELS } from "@/constants/partCategories";

// 部品データを取得する関数
const fetchParts = async (url: string): Promise<PartResponse> => {
  const { data } = await axiosClient.get<PartResponse>(url);
  return data;
};

export default function PartListPage() {
  const router = useRouter();

  // APIのURLを状態として管理
  const [apiUrl, setApiUrl] = useState("/api/masters/parts/");
  // 選択された部品のIDを管理
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const hasSelection = selectedIds.length > 0;

  // React Queryを使用してデータを取得
  const {
    data: parts,
    isLoading,
    isError,
  } = useQuery<PartResponse>({
    queryKey: ["parts", apiUrl],
    queryFn: () => fetchParts(apiUrl),
    placeholderData: (previousData: PartResponse | undefined) => previousData,
  });

  // ページネーションハンドラー
  const handlePrevPage = () => {
    if (parts?.previous) {
      setApiUrl(parts.previous);
      setSelectedIds([]); // ページ切り替え時に選択をクリア
    }
  };

  const handleNextPage = () => {
    if (parts?.next) {
      setApiUrl(parts.next);
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
    if (!parts) return;

    setSelectedIds(isChecked ? parts.results.map((part) => part.id) : []);
  };

  // 行クリックハンドラー - チェックボックスクリック時は詳細ページに遷移させない
  const handleRowClick = (partId: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName !== "INPUT") {
      // 詳細画面は実装しないのでダミーリンク
      console.log(`部品ID: ${partId} の詳細を表示`);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">
          部品一覧
        </Heading>
        <Stack direction="row" gap={2}>
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => router.push("/part/new")}
          >
            <LuPlus style={{ marginRight: "8px" }} />
            新しい部品を追加
          </Button>
        </Stack>
      </Flex>

      {isLoading ? (
        <Text>読み込み中...</Text>
      ) : isError ? (
        <Text color="red.500">エラーが発生しました。再度お試しください。</Text>
      ) : parts ? (
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
                          selectedIds.length < parts.results.length
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
                    <Table.Cell fontWeight="bold">部品名</Table.Cell>
                    <Table.Cell fontWeight="bold">カテゴリ</Table.Cell>
                    <Table.Cell fontWeight="bold">仕入先</Table.Cell>
                    <Table.Cell fontWeight="bold">原価</Table.Cell>
                    <Table.Cell fontWeight="bold">見積用単価</Table.Cell>
                    <Table.Cell fontWeight="bold">在庫数</Table.Cell>
                    <Table.Cell fontWeight="bold">補充閾値</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {parts.results.map((part: Part) => (
                    <Table.Row
                      key={part.id}
                      onClick={(e) => handleRowClick(part.id, e)}
                      cursor="pointer"
                    >
                      <Table.Cell onClick={(e) => e.stopPropagation()}>
                        <Checkbox.Root
                          checked={selectedIds.includes(part.id)}
                          onCheckedChange={(change) => {
                            const isChecked = change?.checked === true;
                            handleCheckboxChange(part.id, isChecked);
                          }}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      </Table.Cell>
                      <Table.Cell>{part.name}</Table.Cell>
                      <Table.Cell>
                        {PART_CATEGORY_LABELS[part.category]}
                      </Table.Cell>
                      <Table.Cell>{part.supplier.name}</Table.Cell>
                      <Table.Cell>¥{part.cost_price}</Table.Cell>
                      <Table.Cell>¥{part.selling_price}</Table.Cell>
                      <Table.Cell>{part.stock_quantity}</Table.Cell>
                      <Table.Cell>{part.reorder_level}</Table.Cell>
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
                disabled={!parts.previous}
                onClick={handlePrevPage}
              >
                <Icon as={HiChevronLeft} />
              </Button>
              <Text>
                {parts.current} / {parts.total_pages}
              </Text>
              <Button
                size="sm"
                variant="ghost"
                disabled={!parts.next}
                onClick={handleNextPage}
              >
                <Icon as={HiChevronRight} />
              </Button>
            </Flex>

            <Flex align="center" gap={2}>
              <Text>
                {parts.page_size}件/ページ 全{parts.count || 0}件
              </Text>
            </Flex>
          </Flex>
        </>
      ) : null}
    </Box>
  );
}
