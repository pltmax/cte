export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div
        className="w-full h-[72px] bg-gradient-to-r from-[#ffffff] to-[rgba(102,0,204,0.8)] animate-pulse"
        style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.25)" }}
      />
      <main className="mx-auto mt-8 max-w-[90%]">
        <div
          className="bg-white p-[28px]"
          style={{ borderRadius: "var(--main-card-corner-radius)" }}
        >
          <div
            className="min-h-[500px] border bg-gray-50 animate-pulse"
            style={{ borderRadius: "var(--text-field-corner-radius)" }}
          />
        </div>
      </main>
    </div>
  );
}
