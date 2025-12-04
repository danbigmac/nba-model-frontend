import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Modeling App",
  description: "A modern web app with modeling and blog features",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
        <nav className="flex justify-between items-center p-4 bg-green-800 text-white">
          <h1 className="text-lg font-bold">Modeling App</h1>
          <div className="space-x-4">
            <Link href="/">Home</Link>
            <Link href="/modeling">Modeling</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </nav>
        <main className="flex-1 p-6">{children}</main>
        <footer className="text-center py-4 bg-gray-100 text-sm text-gray-600">
          © {new Date().getFullYear()} Modeling App
        </footer>
      </body>
    </html>
  );
}
