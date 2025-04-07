"use client";

import { Box, Heading, Text } from "@chakra-ui/react";

export default function SupplierPage() {
  return (
    <Box>
      <Heading as="h1" mb={4}>
        仕入先
      </Heading>
      <Text>
        ここは仕入先ページです。サイドバーのアクティブ状態をテストしています。
      </Text>
      <Text mt={4}>実際のコンテンツは別のPBIで実装予定です。</Text>
    </Box>
  );
}
