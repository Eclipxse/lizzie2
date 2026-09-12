// Static assets handle the site. This small handler gives the personal MP4
// explicit byte-range support for native video seeking.
export function parseRange(value, length) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2])) return null;
  const start = match[1] ? Number(match[1]) : Math.max(0, length - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(length - 1, Number(match[2])) : length - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= length) return null;
  return { start, end };
}

export default {
  async fetch(request, env) {
    const upstreamRequest = new Request(request);
    upstreamRequest.headers.delete('Range');
    upstreamRequest.headers.delete('If-Range');
    const response = await env.ASSETS.fetch(upstreamRequest);
    if (response.status !== 200 || !response.headers.get('content-type')?.startsWith('video/mp4')) return response;

    const headers = new Headers(response.headers);
    headers.set('Accept-Ranges', 'bytes');
    const rangeHeader = request.headers.get('Range');
    const ifRange = request.headers.get('If-Range');
    const unchanged = !ifRange || (!ifRange.startsWith('W/') && (ifRange === headers.get('ETag') || ifRange === headers.get('Last-Modified')));
    if (request.method !== 'GET' || !rangeHeader || !unchanged) {
      return new Response(response.body, { status: 200, headers });
    }

    const bytes = await response.arrayBuffer();
    const range = parseRange(rangeHeader, bytes.byteLength);
    if (!range) {
      headers.set('Content-Range', `bytes */${bytes.byteLength}`);
      headers.set('Content-Length', '0');
      return new Response(null, { status: 416, headers });
    }
    const { start, end } = range;
    headers.set('Content-Range', `bytes ${start}-${end}/${bytes.byteLength}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(bytes.slice(start, end + 1), { status: 206, headers });
  },
};
