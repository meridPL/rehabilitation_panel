"use client";

import { Button } from "@/ui/button";
import Input from "@/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, SubmitEvent } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);

  const registerUser = async (data: {
    name: string;
    surname: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message ?? "Rejestracja nie powiodła się");
    }
    return json;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.token) {
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      setRegisterError(
        error instanceof Error ? error.message : "Rejestracja nie powiodła się",
      );
    },
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError(null);

    const nameTrimmed = name.trim();
    const surnameTrimmed = surname.trim();
    const emailTrimmed = email.trim();
    const validationErrors: string[] = [];

    if (!nameTrimmed) {
      validationErrors.push("Imię jest wymagane");
    }
    if (!surnameTrimmed) {
      validationErrors.push("Nazwisko jest wymagane");
    }
    if (!emailTrimmed) {
      validationErrors.push("Email jest wymagany");
    } else if (!EMAIL_REGEX.test(emailTrimmed)) {
      validationErrors.push("Nieprawidłowy format adresu email");
    }
    if (!password) {
      validationErrors.push("Hasło jest wymagane");
    } else if (password.length < 6) {
      validationErrors.push("Hasło musi mieć min. 6 znaków");
    }

    if (validationErrors.length > 0) {
      setRegisterError(validationErrors.join(". "));
      return;
    }

    mutate({
      name: nameTrimmed,
      surname: surnameTrimmed,
      email: emailTrimmed,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {registerError && (
        <div className="rounded-lg bg-red-50 text-red-700 text-sm p-3">
          {registerError}
        </div>
      )}
      <Input
        label="Imię"
        value={name}
        onChange={setName}
        disabled={isPending}
        autoComplete="given-name"
      />
      <Input
        label="Nazwisko"
        value={surname}
        onChange={setSurname}
        disabled={isPending}
        autoComplete="family-name"
      />
      <Input
        label="Email (login)"
        value={email}
        onChange={setEmail}
        disabled={isPending}
        type="email"
        autoComplete="email"
      />
      <Input
        label="Hasło (min. 6 znaków)"
        value={password}
        onChange={setPassword}
        disabled={isPending}
        type="password"
        autoComplete="new-password"
      />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Rejestrowanie…" : "Zarejestruj się"}
      </Button>
    </form>
  );
};
