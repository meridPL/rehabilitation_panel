"use client";
import { User } from "@/types/User";
import { Button } from "@/ui/button";
import Input from "@/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const UserCard = ({ user }: { user: User }) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.name);
  const [lastName, setLastName] = useState(user.surname);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? "Błąd zapisu");
      }
      return data;
    },
    onSuccess: () => {
      setSuccess(true);
      setSaving(false);
      setEditing(false);
      setCurrentPassword("");
      setNewPassword("");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
      setSaving(false);
    },
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    mutate();
  };

  const handleCancel = () => {
    setEditing(false);
    setFirstName(user.name);
    setLastName(user.surname);
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium text-slate-800 mb-3">Profil</h2>
        <p className="text-sm text-slate-600 mb-3">
          Login (email): <strong>{user?.email}</strong>
        </p>
        {!editing ? (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-slate-600 text-sm">
              {user?.name} {user?.surname}
            </p>
            <Button type="button" onClick={() => setEditing(true)}>
              Edytuj dane
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3">
            {error && (
              <div className="rounded-lg bg-red-50 text-red-700 text-sm p-2">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 text-green-700 text-sm p-2">
                Zapisano.
              </div>
            )}
            <Input
              label="Imię"
              value={firstName}
              onChange={setFirstName}
              disabled={saving}
            />
            <Input
              label="Nazwisko"
              value={lastName}
              onChange={setLastName}
              disabled={saving}
            />
            <Input
              label="Obecne hasło (jeśli zmieniasz hasło)"
              value={currentPassword}
              onChange={setCurrentPassword}
              disabled={saving}
              type="password"
            />
            <Input
              label="Nowe hasło (opcjonalnie, min. 6 znaków)"
              value={newPassword}
              onChange={setNewPassword}
              disabled={saving}
              type="password"
              autoComplete="new-password"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Zapisywanie…" : "Zapisz"}
              </Button>
              <Button type="button" onClick={handleCancel} disabled={saving}>
                Anuluj
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
