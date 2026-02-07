"use client";
import { Button } from "@/ui/button";
import Input from "@/ui/input";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginUser = async (data: { email: string; password: string }) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 1000),
    );
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message ?? "Logowanie nie powiodło się");
    }
    return json;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.token) {
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      setLoginError(error instanceof Error ? error.message : "Logowanie nie powiodło się");
    },
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailTrimmed = email.trim();
    const validationErrors: string[] = [];

    if (!emailTrimmed) {
      validationErrors.push("Email jest wymagany");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      validationErrors.push("Nieprawidłowy format adresu email");
    }
    if (!password) {
      validationErrors.push("Hasło jest wymagane");
    }

    if (validationErrors.length > 0) {
      setLoginError(validationErrors.join(". "));
      return;
    }

    mutate({ email: emailTrimmed, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginError && (
        <div className="rounded-lg bg-red-50 text-red-700 text-sm p-3">
          {loginError}
        </div>
      )}
      <Input
        label="Email (login)"
        value={email}
        onChange={setEmail}
        disabled={isPending}
        type="email"
        autoComplete="email"
      />
      <Input
        label="Hasło"
        value={password}
        onChange={setPassword}
        disabled={isPending}
        type="password"
        autoComplete="current-password"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Logowanie…" : "Zaloguj się"}
      </Button>
      <p className="text-center text-sm text-slate-500">
        Nie masz konta?{" "}
        <Link
          href="/register"
          className="text-slate-700 underline hover:no-underline"
        >
          Zarejestruj się
        </Link>
      </p>
    </form>
  );
};
