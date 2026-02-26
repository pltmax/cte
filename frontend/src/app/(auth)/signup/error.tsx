"use client";

export default function SignupError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-red-600 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="text-[#6600CC] text-sm font-semibold hover:underline"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
