"use client";

import { useState } from "react";
import { Box, Button, Heading, Stack, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SupplierFormData } from "@/types";

export default function NewSupplierPage() {
  const router = useRouter();

  // キャンセルボタンの処理
  const handleCancel = () => {
    router.back();
  };

  return (
    <Box>
      <Heading as="h1" mb={6}>
        仕入先登録
      </Heading>
    </Box>
  );
}
