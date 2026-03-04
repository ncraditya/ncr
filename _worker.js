export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Gemini API route
    if (url.pathname === '/api/gemini') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        });
      }
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }
      const keys = [env.GEMINI_API_KEY_1, env.GEMINI_API_KEY_2];
      const body = await request.json();
      const keyIndex = body.keyIndex || 0;
      const apiKey = keys[keyIndex % keys.length];
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: body.contents })
        }
      );
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // बाकी सब requests normal site पर जाएंगी
    return env.ASSETS.fetch(request);
  }
};
