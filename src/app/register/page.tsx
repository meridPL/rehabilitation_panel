import { RegisterForm } from "@/components/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800 text-center mb-1">
          EgzoTech
        </h1>
        <p className="text-slate-500 text-sm text-center mb-6">
          Utwórz nowe konto
        </p>
        <RegisterForm />
        <p className="text-center text-sm text-slate-500 mt-4">
          Masz już konto?{" "}
          <Link
            href="/"
            className="text-slate-700 underline hover:no-underline"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </main>
  );
}
