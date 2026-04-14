import type { AppConfig } from '../config/appConfig';
import { getPropertyById } from '../services/api/propertyApi';
import { getSavedPropertyList } from '../services/api/savedApi';
import { createServiceFactory } from '../services/serviceFactory';
import { createBackendUsecases } from '../usecases/backendUsecases';
import { searchProperties } from '../usecases/searchUsecase';
import { saveProperty } from '../usecases/saveUsecase';
import { unsaveProperty } from '../usecases/unsaveUsecase';
import { contactAgent, bookVisit } from '../usecases/contactUsecase';

export type AppRuntime = {
  mode: 'mock' | 'backend';
  usecases: {
    search: (
      filters: Parameters<typeof searchProperties>[0],
      pagination: Parameters<typeof searchProperties>[1],
    ) => Promise<unknown>;
    propertyDetail: (propertyId: string) => Promise<unknown>;
    savedList: () => Promise<unknown>;
    save: (input: Parameters<typeof saveProperty>[0]) => Promise<unknown>;
    unsave: (input: Parameters<typeof unsaveProperty>[0]) => Promise<unknown>;
    contact: (payload: Parameters<typeof contactAgent>[0]) => Promise<unknown>;
    bookVisit: (payload: Parameters<typeof bookVisit>[0]) => Promise<unknown>;
    healthCheck: () => Promise<unknown>;
  };
};

export function createAppRuntime(config: AppConfig): AppRuntime {
  if (config.useMockApi) {
    return {
      mode: 'mock',
      usecases: {
        search: searchProperties,
        propertyDetail: getPropertyById,
        savedList: () => getSavedPropertyList(),
        save: saveProperty,
        unsave: unsaveProperty,
        contact: contactAgent,
        bookVisit,
        healthCheck: async () => ({
          ok: true,
          data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
          },
        }),
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
      propertyDetail: backend.propertyDetail,
      savedList: backend.savedList,
      save: (input) => backend.save(input.propertyId),
      unsave: (input) => backend.unsave(input.propertyId),
      contact: backend.contact,
      bookVisit: backend.bookVisit,
      healthCheck: backend.healthCheck,
    },
  };
}
