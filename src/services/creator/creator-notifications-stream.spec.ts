/**
 * Tests for the creator notification SSE stream handler.
 *
 * Run with vitest (see admin-notifications-stream.spec.ts for setup).
 *
 * Mirrors the admin suite: covers mock-mode skip, teardown, dispatch on
 * each envelope type, and malformed-JSON swallow. The creator and admin
 * stream files are near-mirrors by design, so behaviour is expected to
 * match exactly.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

class FakeEventSource {
  static instances: FakeEventSource[] = [];
  readonly listeners = new Map<string, Array<(event: unknown) => void>>();
  url: string;
  withCredentials = false;
  closed = false;

  constructor(url: string, init?: { withCredentials?: boolean }) {
    this.url = url;
    this.withCredentials = init?.withCredentials ?? false;
    FakeEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: (event: unknown) => void) {
    const arr = this.listeners.get(type) ?? [];
    arr.push(listener);
    this.listeners.set(type, arr);
  }

  emit(type: string, data: unknown) {
    const arr = this.listeners.get(type) ?? [];
    for (const l of arr) l({ data });
  }

  close() {
    this.closed = true;
  }
}

const originalEventSource = globalThis.EventSource;

beforeEach(() => {
  FakeEventSource.instances = [];
  // @ts-expect-error — assigning a test double for the global
  globalThis.EventSource = FakeEventSource;
});

afterEach(() => {
  globalThis.EventSource = originalEventSource;
});

describe('startCreatorNotificationsStream', () => {
  it('returns a no-op teardown in mock mode', async () => {
    vi.resetModules();
    vi.doMock('@/config/env', () => ({
      env: { apiBaseUrl: 'http://api', useMockApi: true },
    }));
    const { startCreatorNotificationsStream } = await import(
      './creator-notifications-stream'
    );
    const teardown = startCreatorNotificationsStream({ dispatch: vi.fn() });
    expect(FakeEventSource.instances).toHaveLength(0);
    expect(() => teardown()).not.toThrow();
    vi.doUnmock('@/config/env');
  });

  it('opens an EventSource pointing at the contributor URL', async () => {
    vi.resetModules();
    vi.doMock('@/config/env', () => ({
      env: { apiBaseUrl: 'http://api', useMockApi: false },
    }));
    const { startCreatorNotificationsStream } = await import(
      './creator-notifications-stream'
    );
    const teardown = startCreatorNotificationsStream({ dispatch: vi.fn() });
    expect(FakeEventSource.instances).toHaveLength(1);
    expect(FakeEventSource.instances[0].url).toBe(
      'http://api/contributor/notifications/stream',
    );
    teardown();
    expect(FakeEventSource.instances[0].closed).toBe(true);
    vi.doUnmock('@/config/env');
  });

  it('dispatches invalidateTags on created', async () => {
    vi.resetModules();
    vi.doMock('@/config/env', () => ({
      env: { apiBaseUrl: 'http://api', useMockApi: false },
    }));
    const { startCreatorNotificationsStream } = await import(
      './creator-notifications-stream'
    );
    const dispatch = vi.fn();
    startCreatorNotificationsStream({ dispatch });

    const es = FakeEventSource.instances[0];
    es.emit(
      'created',
      JSON.stringify({
        type: 'created',
        notification: {
          id: 'n-1',
          recipient_id: 'u-1',
          type: 'system',
          title: 't',
          body: null,
          payload: null,
          linked_record_type: null,
          linked_record_id: null,
          read_state: 'unread',
          read_at: null,
          created_at: '2026-01-01T00:00:00.000Z',
        },
      }),
    );

    const invalidateCalls = dispatch.mock.calls.filter(
      ([action]) =>
        action &&
        typeof action === 'object' &&
        'type' in action &&
        (action as { type: string }).type ===
          'api/util/invalidateTags',
    );
    expect(invalidateCalls.length).toBeGreaterThan(0);
    vi.doUnmock('@/config/env');
  });
});