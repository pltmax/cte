export default function ParametresLoading() {
  return (
    <div className="px-6 py-10 max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-gray-100 rounded-lg w-36 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-64 animate-pulse" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.06)" }}
        >
          <div className="h-5 bg-gray-100 rounded w-28 mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-9 bg-gray-100 rounded-lg" />
            <div className="h-9 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-9 bg-gray-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
