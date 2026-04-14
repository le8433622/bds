import { afterEach, describe, expect, it } from 'vitest';
import {
  clearToken,
  getToken,
  hasValidToken,
  resetTokenStorageForTesting,
  saveToken,
  setStoredTokenForTesting,
} from './tokenStorage';

afterEach(() => {
  resetTokenStorageForTesting();
});

describe('tokenStorage', () => {
  it('saves and returns token', async () => {
    await saveToken('abc');
    expect(await getToken()).toBe('abc');
  });

  it('clears token', async () => {
    await saveToken('abc');
    await clearToken();
    expect(await getToken()).toBeNull();
  });

  it('checks valid token', async () => {
    expect(await hasValidToken()).toBe(false);
    await saveToken('abc');
    expect(await hasValidToken()).toBe(true);
  });

  it('supports unicode token values', async () => {
    await saveToken('tôken-🔐');
    expect(await getToken()).toBe('tôken-🔐');
  });

  it('returns null for unsupported stored token format', async () => {
    setStoredTokenForTesting('legacy-token-format');
    expect(await getToken()).toBeNull();
    expect(await hasValidToken()).toBe(false);
  });
});
