import { useState } from "react";
import { X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PreChatForm } from "./PreChatForm";
import { ChatMessages } from "./ChatMessages";

interface ChatWindowProps {
  onClose: () => void;
  onUnreadChange: (count: number) => void;
}

export function ChatWindow({ onClose, onUnreadChange }: ChatWindowProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    topic: string;
  } | null>(null);

  const handleStartChat = (conversationId: string, info: { name: string; email: string; topic: string }) => {
    setConversationId(conversationId);
    setUserInfo(info);
  };

  return (
    <Card className="fixed bottom-6 right-6 w-full md:w-[400px] h-[600px] shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Customer Support</h3>
          <p className="text-xs opacity-90">
            {conversationId ? "We're here to help" : "Start a conversation"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {!conversationId ? (
          <PreChatForm onStartChat={handleStartChat} />
        ) : (
          <ChatMessages
            conversationId={conversationId}
            userInfo={userInfo!}
            onUnreadChange={onUnreadChange}
          />
        )}
      </div>
    </Card>
  );
}
