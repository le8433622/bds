import { describe, expect, it } from 'vitest';
import { createAppUiContainer } from './uiContainer';
import type { AppRuntime } from './runtime';

const property = {
  id: 'p-001',
  title: 'Can ho',
  price: 1,
  location: 'HCM',
  city: 'HCM',
  area: 70,
  bedrooms: 2,
  bathrooms: 2,
  propertyType: 'apartment' as const,
  images: [],
  description: '',
  amenities: [],
  createdAt: '2026-01-01T00:00:00.000Z',
};

function createRuntime(): AppRuntime {
  return {
    mode: 'backend',
    usecases: {
      search: async () => ({ ok: true, data: [property] }),
      propertyDetail: async () => ({ ok: true, data: property }),
      savedList: async () => ({ ok: true, data: [property] }),
      save: async () => ({ ok: true, data: { success: true } }),
      unsave: async () => ({ ok: true, data: { success: true } }),
      contact: async () => ({ ok: true, data: { id: 'c-1' } }),
      bookVisit: async () => ({ ok: true, data: { id: 'v-1' } }),
      healthCheck: async () => ({ ok: true, data: { status: 'ok', timestamp: '2026-01-01T00:00:00.000Z' } }),
    },
  };
}

describe('app ui container', () => {
  it('normalizes runtime search usecase into paginated state', async () => {
    const ui = createAppUiContainer({
      runtime: createRuntime(),
      isLoggedIn: true,
    });

    const state = await ui.search.submit({}, { page: 1, pageSize: 10 });
    expect(state.status).toBe('success');
    expect(state.items).toHaveLength(1);
  });

  it('creates property detail controller wired to runtime usecases', async () => {
    const ui = createAppUiContainer({
      runtime: createRuntime(),
      isLoggedIn: true,
    });

    const detail = ui.createPropertyDetail('p-001');
    const saveState = await detail.toggleSave();
    expect(saveState.isSaved).toBe(true);

    const contactState = await detail.contactAgent({
      propertyId: 'p-001',
      fullName: 'A',
      phone: '0909',
    });
    expect(contactState.lastContactRequestId).toBe('c-1');
  });
});
