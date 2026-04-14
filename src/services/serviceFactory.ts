import { createHttpClient } from './api/httpClient';
import { createPropertyApiGateway, type PropertyApiGateway } from './api/propertyApiHttp';
import { createSavedApiGateway, type SavedApiGateway } from './api/savedApiHttp';
import { createContactApiGateway, type ContactApiGateway } from './api/contactApiHttp';
import { createHealthApiGateway, type HealthApiGateway } from './api/healthApiHttp';

export type ServiceFactory = {
  propertyGateway: PropertyApiGateway;
  savedGateway: SavedApiGateway;
  contactGateway: ContactApiGateway;
  healthGateway: HealthApiGateway;
};

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export function createServiceFactory(input: {
  apiBaseUrl: string;
  timeoutMs: number;
  retryCount?: number;
  retryDelayMs?: number;
  fetchFn?: FetchFn;
}): ServiceFactory {
  const client = createHttpClient({
    baseUrl: input.apiBaseUrl,
    timeoutMs: input.timeoutMs,
    retryCount: input.retryCount,
    retryDelayMs: input.retryDelayMs,
    fetchFn: input.fetchFn,
  });

  return {
    propertyGateway: createPropertyApiGateway(client),
    savedGateway: createSavedApiGateway(client),
    contactGateway: createContactApiGateway(client),
    healthGateway: createHealthApiGateway(client),
  };
}
