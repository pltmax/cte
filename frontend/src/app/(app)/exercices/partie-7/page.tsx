import Part7Shell from "@/components/exam/Part7Shell";

export default function Partie7Page() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <Part7Shell />
        </div>
      </div>
    </main>
  );
}
