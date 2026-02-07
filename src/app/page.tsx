import { LoginForm } from "../components/login-form";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800 text-center mb-1">
          EgzoTech
        </h1>
        <p className="text-slate-500 text-sm text-center mb-6">
          Plan rehabilitacji
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
