import { buildLlmsTxt } from '../lib/llmsTxt.js';

/** AI-oriented site summary at /llms.txt (host follows PUBLIC_SITE_URL). */
export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
