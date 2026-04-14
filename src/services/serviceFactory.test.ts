import { describe, expect, it } from 'vitest';
import { createServiceFactory } from './serviceFactory';

describe('serviceFactory', () => {
  it('creates all gateway adapters', () => {
    const factory = createServiceFactory({
      apiBaseUrl: 'https://api.example.com',
      timeoutMs: 5000,
    });

    expect(typeof factory.propertyGateway.list).toBe('function');
    expect(typeof factory.savedGateway.add).toBe('function');
    expect(typeof factory.contactGateway.contact).toBe('function');
    expect(typeof factory.healthGateway.check).toBe('function');
  });
});
