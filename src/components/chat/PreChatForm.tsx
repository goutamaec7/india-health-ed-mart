import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createConversation, createSupportTicket } from "@/lib/api/chat";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface PreChatFormProps {
  onStartChat: (conversationId: string, info: { name: string; email: string; topic: string }) => void;
}

export function PreChatForm({ onStartChat }: PreChatFormProps) {
  const [loading, setLoading] = useState(false);
  const [isOffline] = useState(true); // Set to true for MVP (manual mode)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.topic || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      if (isOffline) {
        // Create support ticket for offline mode
        const ticket = await createSupportTicket({
          user_name: formData.name,
          user_email: formData.email,
          topic: formData.topic,
          message: formData.message,
        });

        toast.success(
          `Ticket ${ticket.ticket_number} created! We'll respond via email within 24 hours.`
        );
        
        // Reset form
        setFormData({ name: "", email: "", topic: "", message: "" });
      } else {
        // Create live chat conversation
        const conversation = await createConversation({
          user_name: formData.name,
          user_email: formData.email,
          topic: formData.topic,
        });

        onStartChat(conversation.id, {
          name: formData.name,
          email: formData.email,
          topic: formData.topic,
        });
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="text-center">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold mb-2">
          {isOffline ? "We're Currently Offline" : "Start a Conversation"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isOffline
            ? "Leave a message and we'll get back to you via email within 24 hours."
            : "Fill in the form below to connect with our support team."}
        </p>
        {isOffline && (
          <p className="text-xs text-muted-foreground mt-2">
            Hours: 10 AM - 6 PM IST, Monday - Friday
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic *</Label>
          <Select
            value={formData.topic}
            onValueChange={(value) => setFormData({ ...formData, topic: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order_issue">Order Issue</SelectItem>
              <SelectItem value="product_question">Product Question</SelectItem>
              <SelectItem value="technical_support">Technical Support</SelectItem>
              <SelectItem value="billing">Billing & Payments</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="How can we help you today?"
            rows={4}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isOffline ? (
            "Send Message"
          ) : (
            "Start Chat"
          )}
        </Button>
      </form>
    </div>
  );
}
