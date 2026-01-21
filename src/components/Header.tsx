import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-purple-600">
            Masajes Bolivia
          </Link>
          <div className="flex items-center gap-4">
            <AuthButton />
            <Link
              href="/publicar"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Publicar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
