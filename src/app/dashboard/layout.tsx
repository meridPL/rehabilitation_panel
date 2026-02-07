import Link from "next/link";
import { LogoutButton } from "./components/logout";
import { getCurrentUser } from "@/db/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="font-semibold text-slate-800">
            EgzoTech
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.name} {user?.surname}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
