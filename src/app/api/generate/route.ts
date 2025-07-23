import { NextResponse } from 'next/server';
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const response = streamText({
      model: openai("gpt-4o-mini"),
      system: "You are an AI assistant processing a JavaScript array of chat messages. Analyze the user's latest request, referencing past requests, and respond directly to their query. Only mention what they wrote before if it's relevant.",
      prompt: JSON.stringify(messages, null, 2),
      abortSignal: req.signal,
      maxTokens: 1000,
      onError({ error }) {
        console.error('streamText error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
    });

    return response.toTextStreamResponse({
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no" // Prevents nginx from buffering
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}