import { createClient } from "@/lib/supabase/server";
import AdCard from "@/components/AdCard";
import { Ad } from "@/lib/types";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const { data: ads, error } = await supabase
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ads:", error);
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Masajes en Bolivia
        </h1>
        <p className="text-gray-600">
          Encuentra masajistas profesionales cerca de ti
        </p>
      </div>

      {!ads || ads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No hay anuncios disponibles</p>
          <a
            href="/publicar"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ¡Sé el primero en publicar!
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad: Ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
