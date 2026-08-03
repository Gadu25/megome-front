export default function DashboardLoading() {
  return (
    <div className="bg-base-100 flex">
      <main className="flex-1 space-y-6">

        <div>
          <div className="skeleton h-8 w-40 rounded" />
          <div className="skeleton h-4 w-72 rounded mt-2" />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-base-300 bg-base-100 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="skeleton h-4 w-20 rounded" />
                <div className="skeleton size-5 rounded" />
              </div>
              <div className="skeleton h-8 w-16 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="skeleton h-5 w-32 rounded" />
            <div className="skeleton h-3 w-36 rounded" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
            <div className="skeleton h-9 w-full rounded" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="flex items-center gap-2">
              <div className="skeleton h-9 w-28 rounded" />
              <div className="skeleton h-9 flex-1 rounded" />
              <div className="skeleton h-9 w-24 rounded" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-5 w-24 rounded" />
            </div>
            <div className="skeleton h-32 w-full rounded-xl mt-2" />
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="rounded-2xl border border-base-300 p-5 lg:col-span-2">
            <div className="skeleton h-5 w-44 rounded mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="skeleton h-2 w-full rounded-full" />
                </div>
              ))}
              <div className="border-t border-base-300 pt-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="skeleton h-4 w-20 rounded" />
                    <div className="skeleton h-6 w-16 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-base-300 p-5">
            <div className="skeleton h-5 w-28 rounded mb-4" />
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-9 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
