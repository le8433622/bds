import type { BookVisitPayload, BookVisitRequest, ContactRequest, ContactRequestPayload } from '../../types/contact';
import { validateBookVisitRequest, validateContactRequest } from '../../utils/contactValidators';

const contactRequests: ContactRequest[] = [];
const visitRequests: BookVisitRequest[] = [];

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`;
}

export async function createContactRequest(payload: ContactRequestPayload): Promise<ContactRequest> {
  const errors = validateContactRequest(payload);
  if (errors.length > 0) {
    throw new Error(errors.join(' | '));
  }

  const created: ContactRequest = {
    ...payload,
    id: createId('contact'),
    createdAt: new Date().toISOString(),
  };

  contactRequests.push(created);
  return created;
}

export async function createBookVisitRequest(payload: BookVisitPayload): Promise<BookVisitRequest> {
  const errors = validateBookVisitRequest(payload);
  if (errors.length > 0) {
    throw new Error(errors.join(' | '));
  }

  const created: BookVisitRequest = {
    ...payload,
    id: createId('visit'),
    createdAt: new Date().toISOString(),
  };

  visitRequests.push(created);
  return created;
}

export function getContactRequests(): ContactRequest[] {
  return [...contactRequests];
}

export function getVisitRequests(): BookVisitRequest[] {
  return [...visitRequests];
}

export function resetContactStateForTesting(): void {
  contactRequests.length = 0;
  visitRequests.length = 0;
}
