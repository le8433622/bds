import type { BookVisitPayload, ContactRequestPayload } from '../types/contact';
import { createBookVisitRequest, createContactRequest } from '../services/api/contactApi';

export async function contactAgent(payload: ContactRequestPayload) {
  return createContactRequest(payload);
}

export async function bookVisit(payload: BookVisitPayload) {
  return createBookVisitRequest(payload);
}
