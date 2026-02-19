"use client";

import { Instagram } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BeholdWidget from "@behold/react";
import Image from "next/image";

interface InstagramPost {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export function InstagramFeed() {
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://w.behold.so/widget.js";
  //   script.type = "module";
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/instagram");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.data) {
          setPosts(data.data);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <section className="w-full bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-full mb-4 ring-2 ring-white/50">
            <Instagram className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-white text-3xl font-bold mb-2">
            Síguenos en Instagram
          </h2>
          <p className="text-white/70 mb-6 font-medium">
            Descubre las mejores experiencias en @fincasya
          </p>
          <Link
            href="https://www.instagram.com/fincasya.com_alquileres/?hl=es"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E1306C] rounded-full text-sm font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Instagram className="w-5 h-5" />
            Ver perfil completo
          </Link>
        </div>
        <BeholdWidget feedId="i1B2bM2AWfZ1tICFxYXu" />
      </div>
    </section>
  );
}
