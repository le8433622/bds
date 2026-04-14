import { describe, expect, it } from 'vitest';
import type { Property } from '../../types/models';
import {
  buildPropertyDetailViewModel,
  createPropertyDetailController,
  getPropertySummary,
} from './PropertyDetailScreen';

const property: Property = {
  id: 'p-001',
  title: 'Can ho 2PN',
  price: 3200000000,
  location: 'Thu Duc',
  city: 'HCM',
  district: 'Quan 2',
  area: 78,
  bedrooms: 2,
  bathrooms: 2,
  propertyType: 'apartment',
  images: [],
  description: 'desc',
  amenities: [],
  createdAt: '2026-04-10T10:00:00.000Z',
};

describe('PropertyDetailScreen', () => {
  it('loads property and returns summary string', async () => {
    const controller = createPropertyDetailController({
      loadProperty: async () => property,
      save: async () => ({ ok: true, savedIds: ['p-001'] }),
      contact: async () => ({ id: 'contact-1' }),
    });

    const state = await controller.load('p-001');
    expect(state.status).toBe('success');
    expect(getPropertySummary(property)).toContain('Thu Duc');
  });

  it('supports save/unsave with pending state handling', async () => {
    const controller = createPropertyDetailController({
      loadProperty: async () => property,
      save: async () => ({ ok: true, savedIds: ['p-001'] }),
      unsave: async () => ({ ok: true, data: { success: true } }),
      contact: async () => ({ id: 'contact-1' }),
    });

    await controller.load('p-001');
    const saved = await controller.toggleSave();
    expect(saved.isSaved).toBe(true);
    expect(saved.isSavePending).toBe(false);

    const unsaved = await controller.toggleSave();
    expect(unsaved.isSaved).toBe(false);
  });

  it('uses contact mode and stores last contact id', async () => {
    const methods: string[] = [];
    const controller = createPropertyDetailController({
      loadProperty: async () => property,
      save: async () => ({ ok: true, savedIds: ['p-001'] }),
      contact: async (payload) => {
        methods.push(payload.preferredMethod);
        return { id: 'contact-2' };
      },
    });

    await controller.load('p-001');
    controller.setContactMode('form');
    const state = await controller.contactAgent({
      propertyId: 'p-001',
      fullName: 'A',
      phone: '0909',
      message: 'hello',
    });

    expect(methods).toEqual(['form']);
    expect(state.lastContactRequestId).toBe('contact-2');
    expect(state.isContactPending).toBe(false);
  });

  it('handles save/contact failures and exposes error state', async () => {
    const controller = createPropertyDetailController({
      loadProperty: async () => property,
      save: async () => ({ ok: false, reason: 'NETWORK_ERROR' }),
      contact: async () => {
        throw new Error('contact failed');
      },
    });

    await controller.load('p-001');
    const saveFailed = await controller.toggleSave();
    expect(saveFailed.errorMessage).toContain('NETWORK_ERROR');
    expect(saveFailed.isSaved).toBe(false);

    const contactFailed = await controller.contactAgent({
      propertyId: 'p-001',
      fullName: 'A',
      phone: '0909',
    });
    expect(contactFailed.errorMessage).toContain('contact failed');
  });

  it('builds full listing view-model fields for render layer', () => {
    const viewModel = buildPropertyDetailViewModel(property);
    expect(viewModel.priceLabel).toContain('₫');
    expect(viewModel.addressLabel).toContain('Quan 2');
    expect(viewModel.areaLabel).toContain('m2');
    expect(viewModel.bedrooms).toBe(2);
    expect(viewModel.bathrooms).toBe(2);
    expect(viewModel.description).toBe(property.description);
  });
});
