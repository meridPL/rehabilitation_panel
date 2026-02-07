export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-6 w-48 bg-slate-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
      </div>

      <section>
        <div className="h-5 w-24 bg-slate-200 rounded mb-3 animate-pulse" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <div className="flex justify-center py-8">
          <div
            className="h-8 w-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin"
            aria-hidden
          />
        </div>
      </section>
    </div>
  );
}
