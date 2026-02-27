import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ConversationsPanel } from "./conversations-panel";

export function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResizablePanelGroup
      className="flex-1 h-full min-h-0"
      orientation="horizontal"
    >
      <ResizablePanel defaultSize={32} minSize={20} className="bg-white">
        <div className="flex h-full flex-col overflow-hidden">
          <ConversationsPanel />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="max-lg:hidden" />
      <ResizablePanel defaultSize={75} minSize={30}>
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
