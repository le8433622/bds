let encodedToken: string | null = null;
let cachedKeyPromise: Promise<CryptoKey> | null = null;

const LEGACY_TOKEN_PREFIX = 'v1:';
const ENCRYPTED_TOKEN_PREFIX = 'v2:';

type StoredTokenPayload = {
  token: string;
  expiresAt?: string;
};

function getTokenEncryptionSecret(): string {
  const env = (globalThis as { process?: { env?: Record<string, string> } }).process?.env ?? {};
  const secret = env.TOKEN_ENCRYPTION_KEY ?? 'homefinder-default-token-key';
  return secret.trim().length > 0 ? secret : 'homefinder-default-token-key';
}

function bytesToBase64(bytes: Uint8Array): string {
  const bufferApi = (globalThis as {
    Buffer?: { from(input: Uint8Array | string, encoding?: string): { toString(encoding: string): string } };
  }).Buffer;
  if (bufferApi) {
    return bufferApi.from(bytes).toString('base64');
  }

  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array | null {
  try {
    const bufferApi = (globalThis as {
      Buffer?: { from(input: Uint8Array | string, encoding?: string): Uint8Array };
    }).Buffer;
    if (bufferApi) {
      return new Uint8Array(bufferApi.from(base64, 'base64'));
    }

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function encodeLegacyToken(raw: string): string {
  return bytesToBase64(new TextEncoder().encode(raw));
}

function decodeLegacyToken(encoded: string): string | null {
  const bytes = base64ToBytes(encoded);
  if (!bytes) {
    return null;
  }
  return new TextDecoder().decode(bytes);
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const cloned = new Uint8Array(bytes.byteLength);
  cloned.set(bytes);
  return cloned.buffer;
}

function parseStoredTokenPayload(raw: string): StoredTokenPayload | null {
  try {
    const parsed = JSON.parse(raw) as { token?: unknown; expiresAt?: unknown };
    if (typeof parsed.token === 'string' && parsed.token.trim().length > 0) {
      return {
        token: parsed.token,
        ...(typeof parsed.expiresAt === 'string' ? { expiresAt: parsed.expiresAt } : {}),
      };
    }
  } catch {
    // fallback to raw token string
  }

  if (raw.trim().length === 0) {
    return null;
  }

  return { token: raw };
}

function isExpired(expiresAt?: string): boolean {
  if (!expiresAt) {
    return false;
  }

  const deadline = Date.parse(expiresAt);
  if (!Number.isFinite(deadline)) {
    return true;
  }

  return Date.now() >= deadline;
}

function getCryptoApi(): Crypto | null {
  if (typeof globalThis.crypto === 'undefined') {
    return null;
  }

  if (!globalThis.crypto.subtle || typeof globalThis.crypto.getRandomValues !== 'function') {
    return null;
  }

  return globalThis.crypto;
}

async function getAesKey(): Promise<CryptoKey> {
  if (cachedKeyPromise) {
    return cachedKeyPromise;
  }

  cachedKeyPromise = (async () => {
    const cryptoApi = getCryptoApi();
    if (!cryptoApi) {
      throw new Error('CRYPTO_UNAVAILABLE');
    }

    const digest = await cryptoApi.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(getTokenEncryptionSecret()),
    );
    return cryptoApi.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
  })();

  return cachedKeyPromise;
}

async function encryptToken(raw: string): Promise<string | null> {
  const cryptoApi = getCryptoApi();
  if (!cryptoApi) {
    return null;
  }

  const iv = cryptoApi.getRandomValues(new Uint8Array(12));
  const key = await getAesKey();
  const cipherBuffer = await cryptoApi.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(raw),
  );

  const cipherBytes = new Uint8Array(cipherBuffer);
  return `${ENCRYPTED_TOKEN_PREFIX}${bytesToBase64(iv)}:${bytesToBase64(cipherBytes)}`;
}

async function decryptToken(value: string): Promise<string | null> {
  if (!value.startsWith(ENCRYPTED_TOKEN_PREFIX)) {
    return null;
  }

  const payload = value.slice(ENCRYPTED_TOKEN_PREFIX.length);
  const [ivBase64, cipherBase64] = payload.split(':');
  if (!ivBase64 || !cipherBase64) {
    return null;
  }

  const iv = base64ToBytes(ivBase64);
  const cipher = base64ToBytes(cipherBase64);
  if (!iv || !cipher) {
    return null;
  }

  try {
    const cryptoApi = getCryptoApi();
    if (!cryptoApi) {
      return null;
    }
    const key = await getAesKey();
    const plainBuffer = await cryptoApi.subtle.decrypt(
      { name: 'AES-GCM', iv: toArrayBuffer(iv) },
      key,
      toArrayBuffer(cipher),
    );
    return new TextDecoder().decode(plainBuffer);
  } catch {
    return null;
  }
}

export async function saveToken(value: string): Promise<void> {
  const payload = JSON.stringify({ token: value } satisfies StoredTokenPayload);
  const encrypted = await encryptToken(payload);
  if (encrypted) {
    encodedToken = encrypted;
    return;
  }

  encodedToken = `${LEGACY_TOKEN_PREFIX}${encodeLegacyToken(payload)}`;
}

export async function saveSessionToken(input: {
  token: string;
  expiresAt: string;
}): Promise<void> {
  const payload = JSON.stringify({
    token: input.token,
    expiresAt: input.expiresAt,
  } satisfies StoredTokenPayload);
  const encrypted = await encryptToken(payload);
  if (encrypted) {
    encodedToken = encrypted;
    return;
  }

  encodedToken = `${LEGACY_TOKEN_PREFIX}${encodeLegacyToken(payload)}`;
}

export async function getToken(): Promise<string | null> {
  if (!encodedToken) {
    return null;
  }

  let rawValue: string | null = null;

  if (encodedToken.startsWith(ENCRYPTED_TOKEN_PREFIX)) {
    rawValue = await decryptToken(encodedToken);
  } else if (encodedToken.startsWith(LEGACY_TOKEN_PREFIX)) {
    rawValue = decodeLegacyToken(encodedToken.slice(LEGACY_TOKEN_PREFIX.length));
  } else {
    return null;
  }

  if (!rawValue) {
    return null;
  }

  const payload = parseStoredTokenPayload(rawValue);
  if (!payload || isExpired(payload.expiresAt)) {
    return null;
  }

  return payload.token;
}

export async function clearToken(): Promise<void> {
  encodedToken = null;
}

export async function hasValidToken(): Promise<boolean> {
  const currentToken = await getToken();
  return Boolean(currentToken && currentToken.trim().length > 0);
}

export function resetTokenStorageForTesting(): void {
  encodedToken = null;
  cachedKeyPromise = null;
}

export function setStoredTokenForTesting(value: string | null): void {
  encodedToken = value;
}
