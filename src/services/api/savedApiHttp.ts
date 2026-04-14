import type { ApiResult } from '../../types/api';
import type { Property } from '../../types/models';
import type { HttpClient } from './httpClient';

export type SavedApiGateway = {
  list(): Promise<ApiResult<Property[]>>;
  add(propertyId: string): Promise<ApiResult<{ success: boolean }>>;
  remove(propertyId: string): Promise<ApiResult<{ success: boolean }>>;
};

export function createSavedApiGateway(client: HttpClient): SavedApiGateway {
  return {
    list() {
      return client.get<Property[]>('/saved-properties', {
        criticality: 'normal',
      });
    },

    add(propertyId: string) {
      return client.post<{ propertyId: string }, { success: boolean }>(
        '/saved-properties',
        { propertyId },
        {
          criticality: 'high',
          idempotencyKey: `saved:add:${propertyId}`,
        },
      );
    },

    remove(propertyId: string) {
      return client.post<{ propertyId: string }, { success: boolean }>(
        '/saved-properties/remove',
        { propertyId },
        {
          criticality: 'high',
          idempotencyKey: `saved:remove:${propertyId}`,
        },
      );
    },
  };
}
