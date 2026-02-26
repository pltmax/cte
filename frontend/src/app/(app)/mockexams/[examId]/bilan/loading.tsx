export default function BilanLoading() {
  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
      <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
      <div className="bg-white rounded-2xl border border-gray-100 px-8 py-10 flex flex-col items-center gap-4">
        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
        <div className="h-16 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 px-8 py-10 flex flex-col items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-64 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}
