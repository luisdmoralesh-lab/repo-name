import { createClient } from "@/lib/supabase/server";
import AdCard from "@/components/AdCard";
import SortSelector from "@/components/SortSelector";
import { Ad } from "@/lib/types";
import { Suspense } from "react";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { sort } = await searchParams;
  const supabase = await createClient();

  const sortBy = sort === "popular" ? "likes" : "created_at";

  const { data: ads, error } = await supabase
    .from("ads")
    .select("*")
    .order(sortBy, { ascending: false });

  if (error) {
    console.error("Error fetching ads:", error);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white mb-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            La mejor plataforma de masajes en Bolivia
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Masajes en Bolivia
          </h1>
          <p className="text-lg sm:text-xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Encuentra masajistas profesionales cerca de ti. Relájate y renueva tu energía con los mejores servicios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/publicar"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Publicar anuncio
            </a>
            <a
              href="#anuncios"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Ver anuncios
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Ads Section */}
      <div id="anuncios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Anuncios disponibles
            </h2>
            <p className="text-gray-600 mt-1">
              {ads && ads.length > 0 ? `${ads.length} ${ads.length === 1 ? 'anuncio' : 'anuncios'} encontrados` : 'Explora las mejores opciones'}
            </p>
          </div>
          <Suspense fallback={<div className="h-10" />}>
            <SortSelector />
          </Suspense>
        </div>

        {!ads || ads.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay anuncios disponibles
              </h3>
              <p className="text-gray-600 mb-6">
                Sé el primero en compartir tus servicios con la comunidad
              </p>
              <a
                href="/publicar"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Publicar primer anuncio
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map((ad: Ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
