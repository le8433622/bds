import type { ApiResult } from '../../types/api';
import type { BookVisitPayload, ContactRequestPayload } from '../../types/contact';
import type { HttpClient } from './httpClient';

export type ContactApiGateway = {
  contact(payload: ContactRequestPayload): Promise<ApiResult<{ id: string }>>;
  bookVisit(payload: BookVisitPayload): Promise<ApiResult<{ id: string }>>;
};

export function createContactApiGateway(client: HttpClient): ContactApiGateway {
  return {
    contact(payload) {
      return client.post<ContactRequestPayload, { id: string }>('/contact-request', payload);
    },

    bookVisit(payload) {
      return client.post<BookVisitPayload, { id: string }>('/book-visit', payload);
    },
  };
}
