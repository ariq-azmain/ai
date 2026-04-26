import OpenAI from "openai";

/* ─────────────────────────────────────────────────────────────
   POST /api/chat
   Body : { messages: [{ role: 'user' | 'assistant', content: string }] }
   Returns: plain-text streaming response

   Groq Cloud is OpenAI-API-compatible — just swap baseURL & model.
   Free models: llama-3.3-70b-versatile, llama-3.1-8b-instant,
                mixtral-8x7b-32768, gemma2-9b-it
───────────────────────────────────────────────────────────── */

const client = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are a helpful, knowledgeable, and friendly AI assistant.
Provide clear, accurate, and concise responses.
If you don't know something, say so honestly.
Format responses naturally — use paragraphs, bullet points, or code blocks when it improves clarity.`;

export async function POST(req) {
    try {
        const { messages } = await req.json();

        if (!Array.isArray(messages) || messages.length === 0) {
            return Response.json(
                { error: "Invalid messages format." },
                { status: 400 }
            );
        }

        const stream = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Groq free model
            temperature: 0.7,
            max_tokens: 4096,
            stream: true,
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages]
        });

        const encoder = new TextEncoder();

        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache, no-store",
                "X-Accel-Buffering": "no"
            }
        });
    } catch (error) {
        console.error("[/api/chat]", error);

        const message =
            error?.status === 401
                ? "Invalid Groq API key — check .env.local."
                : error?.status === 429
                  ? "Groq rate limit exceeded. Try again shortly."
                  : error?.message || "Unexpected server error.";

        return Response.json(
            { error: message },
            { status: error?.status || 500 }
        );
    }
}
