"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTES = [
  { href: "/modeling", label: "Model Evaluation" },
  { href: "/modeling/predict-next", label: "Predict Next" },
];

export default function ModelingModeNav() {
  const pathname = usePathname();

  return (
    <nav className="inline-flex rounded-lg border border-earth-300 bg-earth-50 p-1">
      {ROUTES.map((route) => {
        const isActive = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-forest-600 text-white"
                : "text-earth-800 hover:bg-earth-200"
            }`}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
