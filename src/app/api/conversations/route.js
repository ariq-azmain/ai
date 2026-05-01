import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

// GET /api/conversations — list all conversations for current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

// POST /api/conversations — create new conversation
export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { title } = await req.json();

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, title: title || 'New Chat' })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
