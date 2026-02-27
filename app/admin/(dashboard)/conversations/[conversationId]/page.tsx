"use client";

import { use, useEffect } from "react";
import { ConversationsLayout } from "@/components/admin/conversations/layouts/conversations-layout";
import { ConversationView } from "@/components/admin/conversations/conversation-view";
import { useInboxStore } from "@/store/useInboxStore";

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
