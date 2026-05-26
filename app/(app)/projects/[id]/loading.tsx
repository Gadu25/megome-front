export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-10">

      {/* Back button */}
      <div className="mb-4">
        <div className="skeleton h-4 w-36"></div>
      </div>

      {/* HERO */}
      <header className="space-y-4">

        {/* Header */}
        <div className="space-y-3">
          <div className="skeleton h-8 w-72"></div>

          <div className="flex gap-2">
            <div className="skeleton h-6 w-20 rounded-full"></div>
            <div className="skeleton h-6 w-24 rounded-full"></div>
          </div>
        </div>

        {/* Cover */}
        <div className="skeleton h-72 w-full rounded-xl"></div>

      </header>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* MAIN */}
        <div className="space-y-10 lg:col-span-2">

          {/* Overview */}
          <section className="space-y-3">

            <div className="skeleton h-6 w-32"></div>

            <div className="space-y-2">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-[95%]"></div>
              <div className="skeleton h-4 w-[80%]"></div>
            </div>

          </section>

          {/* Screenshots */}
          <section className="space-y-4">

            <div className="skeleton h-6 w-40"></div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton aspect-video w-full rounded-xl"
                />
              ))}
            </div>

          </section>

        </div>

        {/* SIDEBAR */}
        <aside className="space-y-8">

          {/* Technologies */}
          <section className="space-y-3">

            <div className="skeleton h-4 w-28"></div>

            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-6 w-20 rounded-full"
                />
              ))}
            </div>

          </section>

          {/* Actions */}
          <section className="space-y-3">

            <div className="skeleton h-4 w-28"></div>

            <div className="space-y-2">
              <div className="skeleton h-9 w-full rounded-lg"></div>
              <div className="skeleton h-9 w-full rounded-lg"></div>
            </div>

          </section>

          {/* Metadata */}
          <section className="space-y-3">

            <div className="skeleton h-4 w-24"></div>

            <div className="space-y-2">
              <div className="skeleton h-4 w-40"></div>
              <div className="skeleton h-4 w-48"></div>
            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}