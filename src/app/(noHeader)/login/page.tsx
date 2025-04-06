"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Field,
  Fieldset,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";

import axiosClient from "@/lib/axiosClient";

export default function Login() {
  const router = useRouter();

  // ログイン状態なら/snippetsに遷移させている
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        // トークンのデコード
        const decoded: { exp: number } = jwtDecode(token);
        // トークンの有効期限を確認
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          router.push("/order");
        } else {
          localStorage.removeItem("access_token");
        }
      } catch {
        // jwtDecode()で不正なトークンを検出
        localStorage.removeItem("access_token");
      }
    }
  }, [router]);

  type LoginFormData = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const fetchLogin = async (LoginFormData: LoginFormData) => {
    const { data } = await axiosClient.post("/api/auth/login/", LoginFormData);
    return data;
  };

  const loginMutation = useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data) => {
      const token = data.access;
      if (token) {
        localStorage.setItem("access_token", token);
      }
      router.push("/order");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((LoginFormData) =>
        loginMutation.mutate(LoginFormData)
      )}
    >
      <Flex minH="100vh" align="center" justify="center" bg="gray.50">
        <Fieldset.Root
          size="lg"
          maxW="md"
          p={6}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="md"
          bg="white"
        >
          <Stack>
            <Fieldset.Legend>ログイン</Fieldset.Legend>
          </Stack>

          <Fieldset.Content>
            <Field.Root invalid={!!errors.email}>
              <Field.Label>メールアドレス</Field.Label>
              <Input
                {...register("email", {
                  required: "ユーザー名は必須です",
                })}
                placeholder="ユーザー名を入力"
              />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label>パスワード</Field.Label>
              <PasswordInput
                {...register("password", {
                  required: "パスワードは必須です",
                })}
                placeholder="パスワードを入力"
              />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>
          </Fieldset.Content>
          {loginMutation.isError && (
            <Text color="red.500" fontSize="sm">
              ログインに失敗しました。
            </Text>
          )}

          <Button
            loading={loginMutation.isPending}
            type="submit"
            alignSelf="flex-start"
          >
            ログイン
          </Button>
        </Fieldset.Root>
      </Flex>
    </form>
  );
}
