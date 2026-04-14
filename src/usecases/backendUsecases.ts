import type { ContactRequestPayload, BookVisitPayload } from '../types/contact';
import type { PaginationInput } from '../types/pagination';
import type { SearchFilters } from '../types/search';
import type { ServiceFactory } from '../services/serviceFactory';

export function createBackendUsecases(factory: ServiceFactory) {
  return {
    search(filters: SearchFilters, pagination: PaginationInput) {
      return factory.propertyGateway.list(filters, pagination);
    },

    propertyDetail(propertyId: string) {
      return factory.propertyGateway.detail(propertyId);
    },

    savedList() {
      return factory.savedGateway.list();
    },

    save(propertyId: string) {
      return factory.savedGateway.add(propertyId);
    },

    unsave(propertyId: string) {
      return factory.savedGateway.remove(propertyId);
    },

    contact(payload: ContactRequestPayload) {
      return factory.contactGateway.contact(payload);
    },

    bookVisit(payload: BookVisitPayload) {
      return factory.contactGateway.bookVisit(payload);
    },

    healthCheck() {
      return factory.healthGateway.check();
    },
  };
}
