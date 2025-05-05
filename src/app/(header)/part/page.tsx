"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  Card,
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function PartListPage() {
  const router = useRouter();

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

      <Card.Root>
        <Card.Body p={6}>
          <Flex
            direction="column"
            justify="center"
            align="center"
            minHeight="200px"
            gap={4}
          >
            <Text color="gray.500">部品一覧はこれから実装される予定です</Text>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => router.push("/part/new")}
            >
              新しい部品を登録する
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
