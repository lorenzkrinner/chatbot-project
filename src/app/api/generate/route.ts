import { NextResponse } from 'next/server';
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai";


export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const response = streamText({
      model: openai("gpt-4o-mini"),
      system: "You are an AI assistant processing a JavaScript array of chat messages. Analyze the user's latest request, referencing past requests, and respond directly to their query.Respond in markdown.",
      prompt: messages.toString(),
      abortSignal: req.signal,
      maxTokens: 1000
    });

    return response.toTextStreamResponse({
      headers: {
        "Content-Type": "text/event-stream"
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