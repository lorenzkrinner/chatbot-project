'use client';

import { SendIcon } from "lucide-react";
import React, { useState, useRef, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import type { Message as AIMessage } from 'ai';

interface MessageProps {
  message: AIMessage;
}

const ChatMessage = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-end w-full ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div className="flex flex-col w-fit max-w-[70%]">
        <Card
          className={`p-2.5 h-fit rounded-lg ${isUser ? 'bg-white/50' : 'bg-white/10'} backdrop-blur-sm border border-solid border-white`}>
          <div className="w-full font-normal text-[#160211] text-sm tracking-tight leading-normal whitespace-pre-wrap">
            {message.content}
          </div>
        </Card>
      </div>
    </div>
  );
};

const Loading = () => (
  <div className="flex items-center justify-end p-2.5 w-full">
    <div className="w-2.5 h-2.5 bg-black rounded-full animate-pulse"></div>
  </div>
);

export default function Main() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage: AIMessage = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage: AIMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        assistantMessage.content += chunk;
        setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }]);
      }
    } catch (error) {
      console.error("Error streaming response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  const suggestions = [
    { text: "What can I ask you to do?" },
    { text: "Tell me a joke" },
    { text: "How to start a business" },
  ];

  return (
    <div className="relative flex flex-col items-center justify-between w-full min-h-dvh bg-white p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1/2 h-full top-0 right-0 bg-[#89bcff] rounded-[140px] blur-[150px] opacity-50" />
        <div className="absolute w-1/2 h-full top-[50px] left-0 bg-[#ff86e1] rounded-[207px] blur-[250px] opacity-50" />
      </div>

      <header className="w-full flex flex-col gap-2 items-center justify-center py-4 z-10">
        <Image src="/logomark.png" alt="Logo" width={48} height={48} />
        <h1 className="font-sans font-medium text-[#160211] text-2xl tracking-tight leading-normal">
          Ask our AI anything
        </h1>
      </header>

      <main className="flex flex-col w-full flex-grow justify-end max-w-4xl z-10 overflow-hidden pb-10">
        <div className="flex-grow overflow-y-auto space-y-4 p-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
          {messages.filter(m => m.role === 'user' || m.role === 'assistant').map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <Loading />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="w-full fixed bottom-4 align-middle max-w-4xl flex flex-col items-center pt-4 px-4 z-10">
        {messages.length === 0 && (
          <div className="w-full flex flex-col justify-start items-start gap-2 mb-4">
            <p className="font-bold text-[#56637e] text-sm tracking-tight leading-normal">
              Suggestions on what to ask Our AI
            </p>
            <div className="flex sm:max-md:flex-wrap justify-center gap-4 w-full">
              {suggestions.map((suggestion, index) => (
                <Card
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="flex justify-center p-2.5 h-fit bg-white/50 backdrop-blur-sm border border-solid border-white rounded-lg items-center w-full cursor-pointer hover:bg-white/60 transition-colors"
                >
                  <div className="w-full font-normal text-[#160211] text-sm tracking-tight leading-normal">
                    {suggestion.text}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className=" flex w-full justify-between p-2.5 bg-white rounded-lg border gap-1 border-solid border-[#1602114c] items-center shadow-lg">
          <Textarea
            ref={textareaRef}
            className="border-none shadow-none font-sans font-normal text-[#160211] text-sm tracking-tight leading-normal w-full focus:ring-0 resize-none overflow-y-auto"
            style={{ maxHeight: '30vh' }}
            placeholder="Ask me anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            disabled={isLoading}
          />
          <Button type="submit" variant="ghost" size="icon" className="w-9 h-9 self-end" disabled={isLoading}>
            <SendIcon className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}