// src/app/modeling/page.tsx
import ModelingClient from "./ModelingClient";

export default function ModelingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold mb-2">Modeling Interface</h1>
        <p className="text-gray-600">
          Configure your inputs and run predictions. Results will appear below.
        </p>
      </header>
      <ModelingClient />
    </div>
  );
}
