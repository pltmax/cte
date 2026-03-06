import ExercisesListClient from "@/components/exercices/ExercisesListClient";

export default function ExercicesPage() {
  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground">Exercices</h1>
        <p className="text-sm text-gray-500 mt-1">
          Entraîne-toi par partie pour progresser avant le jour J.
        </p>
      </div>

      <ExercisesListClient />
    </div>
  );
}
