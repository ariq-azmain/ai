import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

// GET /api/conversations/[id]/messages — load messages for a conversation
export async function GET(req, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Verify ownership
  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!conv) return Response.json({ error: 'Not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
