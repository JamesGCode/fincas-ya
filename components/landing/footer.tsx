"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 md:px-10">
      <div className="container mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="block mb-5">
              <Image
                src="/fincas-ya-logo.png"
                alt="FincasYa"
                width={140}
                height={46}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Tu destino para encontrar las mejores fincas de descanso en
              Colombia. Lujo, naturaleza y confort.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-5 text-white">Enlaces</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Todas las Fincas
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Vincúlate
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm mb-5 text-white">Soporte</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Política de Cancelación
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-5 text-white">Contacto</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@fincasya.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+57 (300) 123 4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Bogotá, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-border/30" />

        <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="relative h-12 w-24">
              <Image
                src="/Marca_país_Colombia_logo.svg.png"
                alt="Marca Colombia"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-12 w-24">
              <Image
                src="/fontur_logo.png"
                alt="Fontur"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-12 w-24">
              <Image
                src="/logo_rnt.png"
                alt="Registro Nacional de Turismo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 bg-white rounded-xl px-4">
            <div className="relative h-12 w-32">
              <Image
                src="/SIC.png"
                alt="Superintendencia de Industria y Comercio"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
        <div className=" border-white/5 flex flex-col items-center gap-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} FincasYa. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
