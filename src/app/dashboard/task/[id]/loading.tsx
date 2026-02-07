export default function TaskLoading() {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="h-6 w-48 bg-slate-200 rounded mb-2 animate-pulse" />
      <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
    </div>
  );
}
