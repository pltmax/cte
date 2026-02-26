export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="w-[70px] h-[70px] bg-gray-200 rounded-full mx-auto mb-8 animate-pulse" />
        <div
          className="bg-white px-8 py-10 space-y-5"
          style={{ borderRadius: "var(--main-card-corner-radius)" }}
        >
          <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          <div className="space-y-4 pt-2">
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
