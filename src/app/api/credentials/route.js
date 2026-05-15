import { auth } from '@clerk/nextjs/server';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import supabase from '@/lib/supabase';

/* ─── Encryption helpers ─────────────────────────────────────
   AES-256-GCM — encrypts tokens before storing in Supabase
───────────────────────────────────────────────────────────── */
const KEY = Buffer.from(process.env.CREDENTIAL_ENCRYPTION_KEY, 'utf8').subarray(0, 32);

function encrypt(text) {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(data) {
  const [ivHex, tagHex, encHex] = data.split(':');
  const decipher = createDecipheriv('aes-256-gcm', KEY, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return decipher.update(Buffer.from(encHex, 'hex')) + decipher.final('utf8');
}

/* ─── GET /api/credentials?service=gmail ────────────────────
   Returns decrypted token for a service (never raw from DB)
───────────────────────────────────────────────────────────── */
export async function GET(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const service = new URL(req.url).searchParams.get('service');
  if (!service) return Response.json({ error: 'service param required' }, { status: 400 });

  const { data, error } = await supabase
    .from('user_credentials')
    .select('service, expires_at, access_token, refresh_token')
    .eq('user_id', userId)
    .eq('service', service)
    .single();

  if (error || !data) return Response.json({ connected: false });

  return Response.json({
    connected: true,
    service: data.service,
    expires_at: data.expires_at,
    access_token: decrypt(data.access_token),
    refresh_token: data.refresh_token ? decrypt(data.refresh_token) : null,
  });
}

/* ─── POST /api/credentials ─────────────────────────────────
   Save or update OAuth token for a service
   Body: { service, access_token, refresh_token?, expires_at? }
───────────────────────────────────────────────────────────── */
export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { service, access_token, refresh_token, expires_at } = await req.json();

  if (!service || !access_token) {
    return Response.json({ error: 'service and access_token required' }, { status: 400 });
  }

  const row = {
    user_id: userId,
    service,
    access_token: encrypt(access_token),
    refresh_token: refresh_token ? encrypt(refresh_token) : null,
    expires_at: expires_at || null,
  };

  // Upsert — update if exists, insert if not
  const { error } = await supabase
    .from('user_credentials')
    .upsert(row, { onConflict: 'user_id,service' });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

/* ─── DELETE /api/credentials?service=gmail ─────────────────
   Remove credential for a service (disconnect)
───────────────────────────────────────────────────────────── */
export async function DELETE(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const service = new URL(req.url).searchParams.get('service');
  if (!service) return Response.json({ error: 'service param required' }, { status: 400 });

  const { error } = await supabase
    .from('user_credentials')
    .delete()
    .eq('user_id', userId)
    .eq('service', service);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
