// Zoho Mail API Edge Function
// Sends emails via Zoho Mail API

const ZOHO_CLIENT_ID = Deno.env.get('ZOHO_CLIENT_ID') || '925732931.GXONZFSBYTQ4FN33NEYMZDLQ591JRR';
const ZOHO_CLIENT_SECRET = Deno.env.get('ZOHO_CLIENT_SECRET') || '960c75d42d5aefc568348449c54876d21eadee98a8';
const ZOHO_USER_ID = Deno.env.get('ZOHO_USER_ID') || '925667788';
const ZOHO_ACCOUNT_ID = Deno.env.get('ZOHO_ACCOUNT_ID') || ZOHO_USER_ID;

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  fromName?: string;
  cc?: string;
  bcc?: string;
}

interface ZohoToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// Cache for Zoho access token
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getZohoToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  // Get new token using refresh token
  const refreshToken = Deno.env.get('ZOHO_REFRESH_TOKEN');

  if (!refreshToken) {
    throw new Error('ZOHO_REFRESH_TOKEN not configured');
  }

  const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    refresh_token: refreshToken,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Zoho token error: ${error}`);
  }

  const data: ZohoToken = await response.json();

  // Cache the token (expire 5 minutes before actual expiry)
  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in - 300) * 1000;

  return data.access_token;
}

async function sendEmailViaZoho(token: string, email: EmailRequest): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const mailApiUrl = `https://mail.zoho.com/api/accounts/${ZOHO_ACCOUNT_ID}/messages`;

  const payload: Record<string, unknown> = {
    fromAddress: `noreply@airpakexpress.com`,
    toAddress: email.to,
    subject: email.subject,
    content: email.body,
    mailFormat: 'html',
  };

  if (email.cc) {
    payload.ccAddress = email.cc;
  }
  if (email.bcc) {
    payload.bccAddress = email.bcc;
  }

  const response = await fetch(mailApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error: error };
  }

  const result = await response.json();

  return {
    success: true,
    messageId: result.data?.messageId || result.messageId || `zoho-${Date.now()}`,
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    const { to, subject, body, cc, bcc, fromName } = await req.json() as EmailRequest;

    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: to, subject, body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = await getZohoToken();
    const result = await sendEmailViaZoho(token, { to, subject, body, cc, bcc, fromName });

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
