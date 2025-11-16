import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import {
  getConversationMessages,
  sendMessage,
  subscribeToMessages,
  ChatMessage,
} from "@/lib/api/chat";
import { format } from "date-fns";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessagesProps {
  conversationId: string;
  userInfo: {
    name: string;
    email: string;
    topic: string;
  };
  onUnreadChange: (count: number) => void;
}

export function ChatMessages({
  conversationId,
  userInfo,
  onUnreadChange,
}: ChatMessagesProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const unsubscribe = subscribeToMessages(conversationId, handleNewMessage);
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getConversationMessages(conversationId);
      setMessages(data as ChatMessage[]);
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message: ChatMessage) => {
    setMessages((prev) => {
      // Avoid duplicates
      if (prev.find((m) => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });

    // Update unread count if message is from agent
    if (message.sender_type === "agent") {
      onUnreadChange(1);
      
      // Show notification
      toast.info(`Support: ${message.message.substring(0, 50)}...`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) {
      return;
    }

    try {
      setSending(true);
      await sendMessage({
        conversation_id: conversationId,
        message: inputMessage,
        sender_name: userInfo.name,
      });
      setInputMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender_type === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.sender_type === "system"
                    ? "bg-muted text-muted-foreground text-center text-sm"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.sender_type !== "system" && (
                  <p className="text-xs font-semibold mb-1 opacity-80">
                    {message.sender_name}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {format(new Date(message.created_at), "h:mm a")}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="border-t p-4 flex gap-2 bg-background"
      >
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={sending}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={sending || !inputMessage.trim()}>
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
