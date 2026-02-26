import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* Main Card */}
      <main className="mx-auto mt-8 max-w-[90%]">
        <div
          className="bg-white p-[28px]"
          style={{
            borderRadius: "var(--main-card-corner-radius)",
            boxShadow:
              "var(--main-card-shadow-x) var(--main-card-shadow-y) var(--main-card-shadow-blur) 0px rgba(0,0,0,0.25)",
          }}
        >
          {/* Inner bordered area - empty as in Figma */}
          <div
            className="min-h-[500px] border bg-white"
            style={{
              borderRadius: "var(--text-field-corner-radius)",
              borderColor: "var(--text-field-stroke-color)",
              borderStyle: "solid",
              borderWidth: 1,
            }}
          />
        </div>
      </main>
    </div>
  );
}
