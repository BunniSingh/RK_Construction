import { describe, expect, test, vi } from 'vitest';

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn().mockResolvedValue({ id: 'test' }),
}));

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function MockResend() {
    return { emails: { send: sendMock } };
  }),
}));

import { POST } from '@/app/api/contact/route';

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

describe('POST /api/contact', () => {
  test('rejects a submission missing required fields', async () => {
    const res = await POST(makeRequest({ name: '', email: '', projectType: '', message: '' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test('rejects an email without an @', async () => {
    const res = await POST(makeRequest({ name: 'A', email: 'not-an-email', projectType: 'Other', message: 'Hi' }));
    expect(res.status).toBe(400);
  });

  test('accepts a valid submission', async () => {
    const res = await POST(
      makeRequest({ name: 'Priya', email: 'priya@example.com', projectType: 'Industrial construction', message: 'Please call me.' })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test('returns a clean error response instead of a raw 500 when email delivery fails', async () => {
    sendMock.mockRejectedValueOnce(new Error('Resend API unreachable'));

    const res = await POST(
      makeRequest({ name: 'Priya', email: 'priya@example.com', projectType: 'Industrial construction', message: 'Please call me.' })
    );

    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(typeof body.error).toBe('string');

    sendMock.mockResolvedValueOnce({ id: 'test' });
  });
});
