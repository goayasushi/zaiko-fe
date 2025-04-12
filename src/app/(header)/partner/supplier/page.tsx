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
} from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { LuPlus } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Supplier, SupplierResponse } from "@/types";
import axiosClient from "@/lib/axiosClient";

// 仕入先データを取得する関数
const fetchSuppliers = async (url: string): Promise<SupplierResponse> => {
  const { data } = await axiosClient.get<SupplierResponse>(url);
  return data;
};

export default function SupplierListPage() {
  const router = useRouter();
  // APIのURLを状態として管理
  const [apiUrl, setApiUrl] = useState("/api/masters/suppliers/");

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

  // ページネーションハンドラー
  const handlePrevPage = () => {
    if (suppliers?.previous) {
      setApiUrl(suppliers.previous);
    }
  };

  const handleNextPage = () => {
    if (suppliers?.next) {
      setApiUrl(suppliers.next);
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
                      onClick={() => router.push(`#`)}
                    >
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
    </Box>
  );
}
