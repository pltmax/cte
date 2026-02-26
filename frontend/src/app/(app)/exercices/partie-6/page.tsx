import Part6Shell from "@/components/exam/Part6Shell";

export default function Partie6Page() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <Part6Shell />
        </div>
      </div>
    </div>
  );
}
