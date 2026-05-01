import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

const client = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful, knowledgeable, and friendly AI assistant.
Provide clear, accurate, and concise responses.
If you don't know something, say so honestly.
Format responses naturally — use paragraphs, bullet points, or code blocks when it improves clarity.`;

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { messages, conversationId } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Invalid messages format.' }, { status: 400 });
    }

    const stream = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();
    let fullResponse = '';

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();

          // Save messages to Supabase after streaming completes
          if (conversationId && fullResponse) {
            const lastUserMessage = messages[messages.length - 1];
            await supabase.from('messages').insert([
              { conversation_id: conversationId, role: 'user', content: lastUserMessage.content },
              { conversation_id: conversationId, role: 'assistant', content: fullResponse },
            ]);

            // Update conversation's updated_at
            await supabase
              .from('conversations')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', conversationId);
          }
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('[/api/chat]', error);
    const message =
      error?.status === 401 ? 'Invalid Groq API key.' :
      error?.status === 429 ? 'Rate limit exceeded. Try again shortly.' :
      error?.message || 'Unexpected server error.';
    return Response.json({ error: message }, { status: error?.status || 500 });
  }
}
