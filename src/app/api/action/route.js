import { auth } from '@clerk/nextjs/server';
import { createDecipheriv } from 'crypto';
import supabase from '@/lib/supabase';

/* ─── Decrypt helper (same key as credentials route) ───────── */
const KEY = Buffer.from(process.env.CREDENTIAL_ENCRYPTION_KEY, 'utf8').subarray(0, 32);

function decrypt(data) {
  const [ivHex, tagHex, encHex] = data.split(':');
  const decipher = createDecipheriv('aes-256-gcm', KEY, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return decipher.update(Buffer.from(encHex, 'hex')) + decipher.final('utf8');
}

/* ─── Which service does each action need? ──────────────────── */
const ACTION_SERVICE_MAP = {
  send_email         : 'gmail',
  web_search         : null,        // no credential needed
  sheets_read        : 'sheets',
  sheets_write       : 'sheets',
  drive_create_folder: 'drive',
  drive_delete_folder: 'drive',
  drive_move_file    : 'drive',
  drive_delete_file  : 'drive',
  docs_create        : 'docs',
  docs_update        : 'docs',
  docs_get           : 'docs',
  tasks_create       : 'tasks',
  tasks_update       : 'tasks',
  tasks_delete       : 'tasks',
  tasks_get          : 'tasks',
};

/* ─── POST /api/action ───────────────────────────────────────
   Body: { action: string, params: object }
   1. Checks which service is needed for this action
   2. Fetches & decrypts user token from Supabase
   3. Calls n8n webhook with action + params + token
   4. Returns n8n result
───────────────────────────────────────────────────────────── */
export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, params } = await req.json();

  if (!action) return Response.json({ error: 'action is required' }, { status: 400 });

  const service = ACTION_SERVICE_MAP[action];

  // If action needs a credential, fetch it
  let userToken = null;
  if (service) {
    const { data } = await supabase
      .from('user_credentials')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', userId)
      .eq('service', service)
      .single();

    if (!data) {
      // Tell the frontend — credential missing, redirect user to Settings
      return Response.json(
        {
          error: 'credential_missing',
          service,
          message: `Please connect your ${service} account in Settings > Integrations.`,
        },
        { status: 403 }
      );
    }

    userToken = {
      access_token : decrypt(data.access_token),
      refresh_token: data.refresh_token ? decrypt(data.refresh_token) : null,
      expires_at   : data.expires_at,
    };
  }

  // Call n8n webhook
  try {
    const n8nRes = await fetch(process.env.N8N_WEBHOOK_URL, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        action,
        params,
        userToken,
        userId,
      }),
    });

    if (!n8nRes.ok) {
      const text = await n8nRes.text();
      console.error('[/api/action] n8n error:', text);
      return Response.json({ error: 'n8n call failed', details: text }, { status: 502 });
    }

    const result = await n8nRes.json();
    return Response.json({ success: true, result });

  } catch (err) {
    console.error('[/api/action]', err);
    return Response.json({ error: 'Failed to reach n8n.' }, { status: 500 });
  }
}
