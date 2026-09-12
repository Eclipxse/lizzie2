import assert from 'node:assert/strict';
import worker from '../worker.mjs';

const media = Uint8Array.from({ length: 256 }, (_, i) => i);
const env = { ASSETS: { fetch: async request => {
  assert.equal(request.headers.get('Range'), null);
  return new Response(request.method === 'HEAD' ? null : media, {
    headers: { 'Content-Type': 'video/mp4', 'Content-Length': '256', ETag: '"media-v1"' },
  });
} } };
for (const [range, start, end] of [['bytes=0-31', 0, 31], ['bytes=200-', 200, 255], ['bytes=-16', 240, 255], ['bytes=250-999', 250, 255]]) {
  const response = await worker.fetch(new Request('https://example.test/clip.mp4', { headers: { Range: range } }), env);
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), `bytes ${start}-${end}/256`);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), media.slice(start, end + 1));
}
for (const range of ['bytes=300-', 'bytes=-0', 'bytes=90-10', 'bytes=-', 'bytes=0-1,3-4']) {
  const response = await worker.fetch(new Request('https://example.test/clip.mp4', { headers: { Range: range } }), env);
  assert.equal(response.status, 416);
  assert.equal(response.headers.get('Content-Range'), 'bytes */256');
}
const changed = await worker.fetch(new Request('https://example.test/clip.mp4', { headers: { Range: 'bytes=0-1', 'If-Range': '"old"' } }), env);
assert.equal(changed.status, 200);
assert.equal((await changed.arrayBuffer()).byteLength, 256);
const head = await worker.fetch(new Request('https://example.test/clip.mp4', { method: 'HEAD' }), env);
assert.equal(head.headers.get('Accept-Ranges'), 'bytes');
assert.equal((await head.arrayBuffer()).byteLength, 0);
console.log('11 video byte-range cases passed.');
