import type { AppConfig } from '../config/appConfig';
import { createServiceFactory } from '../services/serviceFactory';
import { createBackendUsecases } from '../usecases/backendUsecases';
import { searchProperties } from '../usecases/searchUsecase';
import { saveProperty } from '../usecases/saveUsecase';
import { contactAgent, bookVisit } from '../usecases/contactUsecase';

export type AppRuntime = {
  mode: 'mock' | 'backend';
  usecases: {
    search: (filters: Parameters<typeof searchProperties>[0], pagination: Parameters<typeof searchProperties>[1]) => Promise<unknown>;
    save: (input: Parameters<typeof saveProperty>[0]) => Promise<unknown>;
    contact: (payload: Parameters<typeof contactAgent>[0]) => Promise<unknown>;
    bookVisit: (payload: Parameters<typeof bookVisit>[0]) => Promise<unknown>;
  };
};

export function createAppRuntime(config: AppConfig): AppRuntime {
  if (config.useMockApi) {
    return {
      mode: 'mock',
      usecases: {
        search: searchProperties,
        save: saveProperty,
        contact: contactAgent,
        bookVisit,
      },
    };
  }

  const factory = createServiceFactory({
    apiBaseUrl: config.apiBaseUrl,
    timeoutMs: config.apiTimeoutMs,
    retryCount: config.apiRetryCount,
    retryDelayMs: config.apiRetryDelayMs,
  });

  const backend = createBackendUsecases(factory);

  return {
    mode: 'backend',
    usecases: {
      search: backend.search,
      save: (input) => backend.save(input.propertyId),
      contact: backend.contact,
      bookVisit: backend.bookVisit,
    },
  };
}
