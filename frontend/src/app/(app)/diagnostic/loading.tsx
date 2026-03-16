export default function DiagnosticLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#6600CC]/20 border-t-[#6600CC] rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Chargement du test…</p>
      </div>
    </div>
  );
}
