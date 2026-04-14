import type { BookVisitPayload, ContactRequestPayload } from '../types/contact';
import { createBookVisitRequest, createContactRequest } from '../services/api/contactApi';
import { consumeContactRateLimit, resetContactRateLimitForTesting } from '../services/security/contactRateLimiter';

const contactInFlight = new Map<string, Promise<Awaited<ReturnType<typeof createContactRequest>>>>();
const visitInFlight = new Map<string, Promise<Awaited<ReturnType<typeof createBookVisitRequest>>>>();

function buildContactDedupeKey(payload: ContactRequestPayload): string {
  return `${payload.propertyId}:${payload.phone}:${payload.preferredMethod}:${payload.message ?? ''}`;
}

function buildVisitDedupeKey(payload: BookVisitPayload): string {
  return `${payload.propertyId}:${payload.phone}:${payload.visitDate}:${payload.note ?? ''}`;
}

export async function contactAgent(payload: ContactRequestPayload) {
  const rateLimit = consumeContactRateLimit(`contact:${payload.phone}`);
  if (!rateLimit.allowed) {
    throw new Error(rateLimit.reason);
  }

  const key = buildContactDedupeKey(payload);
  const existing = contactInFlight.get(key);
  if (existing) {
    return existing;
  }

  const request = createContactRequest(payload);
  contactInFlight.set(key, request);

  try {
    return await request;
  } finally {
    contactInFlight.delete(key);
  }
}

export async function bookVisit(payload: BookVisitPayload) {
  const rateLimit = consumeContactRateLimit(`visit:${payload.phone}`);
  if (!rateLimit.allowed) {
    throw new Error(rateLimit.reason);
  }

  const key = buildVisitDedupeKey(payload);
  const existing = visitInFlight.get(key);
  if (existing) {
    return existing;
  }

  const request = createBookVisitRequest(payload);
  visitInFlight.set(key, request);

  try {
    return await request;
  } finally {
    visitInFlight.delete(key);
  }
}

export function resetContactUsecaseInFlightForTesting(): void {
  contactInFlight.clear();
  visitInFlight.clear();
  resetContactRateLimitForTesting();
}
