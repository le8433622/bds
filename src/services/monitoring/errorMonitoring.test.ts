import { afterEach, describe, expect, it } from 'vitest';
import {
  captureError,
  getCapturedErrors,
  resetErrorMonitoringForTesting,
  setMonitoringProvider,
} from './errorMonitoring';

afterEach(() => {
  resetErrorMonitoringForTesting();
});

describe('errorMonitoring', () => {
  it('captures errors in local buffer', async () => {
    await captureError(new Error('boom'), { module: 'search' });
    const errors = getCapturedErrors();
    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toBe('boom');
  });

  it('forwards to provider and ignores provider failures', async () => {
    const messages: string[] = [];
    setMonitoringProvider({
      captureException(error) {
        messages.push(error.message);
        throw new Error('provider down');
      },
    });

    await expect(captureError(new Error('network issue'))).resolves.toBeUndefined();
    expect(messages).toEqual(['network issue']);
  });
});
