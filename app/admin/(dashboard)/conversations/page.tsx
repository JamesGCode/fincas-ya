"use client";

import { ConversationsLayout } from "@/features/inbox/components/layouts/conversations-layout";
import Image from "next/image";

export default function ConversationsPage() {
  return (
    <ConversationsLayout>
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[#fafafa]">
        <div className="animate-in fade-in zoom-in duration-700">
          <div className="mb-8 flex items-center justify-center">
            <Image
              src="/dark-logo.svg"
              alt="Fincas Ya Logo"
              width={180}
              height={101}
              className="opacity-80 drop-shadow-sm transition-opacity hover:opacity-100"
            />
          </div>
          <div className="-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Bandeja de mensajes
            </h2>
            <p className="text-muted-foreground mt-3 max-w-sm text-sm">
              Elige una conversación de la lista lateral para empezar a chatear
              con tus clientes.
            </p>
          </div>
        </div>
      </div>
    </ConversationsLayout>
  );
}
