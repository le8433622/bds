let encodedToken: string | null = null;
const TOKEN_PREFIX = 'v1:';

function encodeToken(raw: string): string {
  const bytes = new TextEncoder().encode(raw);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function decodeToken(encoded: string): string | null {
  try {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export async function saveToken(value: string): Promise<void> {
  encodedToken = `${TOKEN_PREFIX}${encodeToken(value)}`;
}

export async function getToken(): Promise<string | null> {
  if (!encodedToken) return null;
  if (!encodedToken.startsWith(TOKEN_PREFIX)) return null;
  return decodeToken(encodedToken.slice(TOKEN_PREFIX.length));
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
}

export function setStoredTokenForTesting(value: string | null): void {
  encodedToken = value;
}
