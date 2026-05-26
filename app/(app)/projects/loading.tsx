export default function Loading() {
  return (
    <section className="space-y-6">

      {/* Toolbar */}
      <header
        className="space-y-4 border-b border-base-200 pb-4"
        aria-label="Projects toolbar"
      >

        {/* Top Row */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <div className="skeleton h-10 flex-1 rounded-lg"></div>

          {/* Filter */}
          <div className="skeleton h-10 w-10 rounded-lg shrink-0"></div>

          {/* Create */}
          <div className="skeleton h-10 w-10 rounded-lg shrink-0"></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <div className="skeleton h-10 w-28 rounded-lg"></div>
          <div className="skeleton h-10 w-32 rounded-lg"></div>
        </div>

      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

        {[...Array(8)].map((_, i) => (
          <article
            key={i}
            className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-4"
          >

            {/* Thumbnail */}
            <div className="skeleton aspect-video w-full rounded-lg"></div>

            {/* Title */}
            <div className="skeleton h-5 w-3/4"></div>

            {/* Description */}
            <div className="space-y-2">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-[92%]"></div>
              <div className="skeleton h-4 w-[70%]"></div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <div className="skeleton h-4 w-24"></div>

              <div className="flex gap-2">
                <div className="skeleton h-8 w-8 rounded-md"></div>
                <div className="skeleton h-8 w-8 rounded-md"></div>
              </div>
            </div>

          </article>
        ))}

      </div>

    </section>
  );
}