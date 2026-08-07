import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
        <p className="text-base-content/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <Link href="/api/intro" className="btn btn-ghost">
            API Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
