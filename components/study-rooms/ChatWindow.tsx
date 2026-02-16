"use client";

import { useState } from "react";
import { useStudyRoomMessages } from "@/hooks/useRealtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ChatWindow({ roomId }: { roomId: string }) {
  const { messages, sendMessage, loading } = useStudyRoomMessages(roomId);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-card">
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={msg.users?.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs">
                  {msg.users?.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{msg.users?.name ?? "Unknown"}</p>
                <p className="text-sm text-muted-foreground">{msg.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
      <div className="flex gap-2 p-4 border-t">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}
