export default function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-5">
      <div className="w-full max-w-md">
        <div className="w-[100px] h-[100px] bg-gray-200 rounded-full mx-auto mb-8 animate-pulse" />
        <div
          className="bg-white px-8 py-6 space-y-5"
          style={{ borderRadius: "var(--main-card-corner-radius)" }}
        >
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
