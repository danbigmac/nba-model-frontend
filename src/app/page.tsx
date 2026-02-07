import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center space-y-8 py-16">
      <h1 className="text-4xl font-bold">Welcome to the Modeling App</h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Experiment with data models, or read insights on development and modeling below.
      </p>
      <div className="flex justify-center gap-6">
        <Link href="/modeling" className="px-6 py-3 bg-green-700 text-white rounded-lg">
          Model Evaluation
        </Link>
        <Link href="/modeling/predict-next" className="px-6 py-3 bg-green-600 text-white rounded-lg">
          Predict Next
        </Link>
        <Link href="/blog" className="px-6 py-3 bg-gray-800 text-white rounded-lg">
          Visit the Blog
        </Link>
      </div>
    </div>
  );
}
