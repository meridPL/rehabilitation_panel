"use client";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-slate-600 hover:text-slate-900 underline"
    >
      Wyloguj
    </button>
  );
};
