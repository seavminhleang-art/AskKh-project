export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  const url = new URL(request.url);
  
  // Extract path from request.url or Vercel matched path header
  const matchedPath = request.headers.get('x-matched-path') || url.pathname;
  
  let targetPath = matchedPath
    .replace(/^\/api\/forum/, '')
    .replace(/^\/__forum_api/, '');

  if (!targetPath.startsWith('/')) {
    targetPath = '/' + targetPath;
  }

  const backendBase = process.env.VITE_BASE_FORUM_LOST_URL || process.env.VITE_API_BASE_URL || 'https://forum-istad-api.cheat.casa/api/v1';
  const cleanBase = backendBase.replace(/\/+$/, '');
  const targetUrl = `${cleanBase}${targetPath}${url.search}`;

  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    const lower = key.toLowerCase();
    if (!['origin', 'host', 'referer', 'x-forwarded-host', 'x-forwarded-for'].includes(lower)) {
      headers.set(key, value);
    }
  }

  const init = {
    method: request.method,
    headers,
    redirect: 'follow',
  };

  if (!['GET', 'HEAD'].includes(request.method.toUpperCase())) {
    init.body = request.body;
    init.duplex = 'half';
  }

  try {
    const response = await fetch(targetUrl, init);
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Gateway fetch failed' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
