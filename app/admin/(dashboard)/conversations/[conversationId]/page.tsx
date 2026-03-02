"use client";

import { use, useEffect } from "react";
import { ConversationsLayout } from "@/features/inbox/components/layouts/conversations-layout";
import { ConversationView } from "@/features/inbox/components/conversation-view";
import { useInboxStore } from "@/features/inbox/store/inbox.store";

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}
export default function ConversationIDPage({ params }: PageProps) {
  const { setSelectedConversationId } = useInboxStore();
  const resolvedParams = use(params);
  useEffect(() => {
    if (resolvedParams.conversationId) {
      setSelectedConversationId(resolvedParams.conversationId);
    }
  }, [resolvedParams.conversationId, setSelectedConversationId]);
  return (
    <ConversationsLayout>
      <ConversationView />
    </ConversationsLayout>
  );
}
