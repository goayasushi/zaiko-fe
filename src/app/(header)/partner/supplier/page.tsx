"use client";

import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function SupplierPage() {
  const router = useRouter();

  return (
    <Box>
      <Flex align="center" mb={6}>
        <Heading as="h1">仕入先一覧</Heading>
        <Spacer minW="50px" />
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

      <Text>仕入先一覧のコンテンツはこの後に実装予定です。</Text>
    </Box>
  );
}
