type MonitoringContext = Record<string, string | number | boolean | null>;

export type MonitoringProvider = {
  captureException(error: Error, context?: MonitoringContext): void | Promise<void>;
  captureMessage?(message: string, context?: MonitoringContext): void | Promise<void>;
};

const inMemoryErrors: Array<{ message: string; context?: MonitoringContext; timestamp: string }> = [];

const noopProvider: MonitoringProvider = {
  captureException() {
    // No-op provider; useful for local/test mode.
  },
};

let provider: MonitoringProvider = noopProvider;

export function setMonitoringProvider(nextProvider: MonitoringProvider): void {
  provider = nextProvider;
}

export function resetMonitoringProvider(): void {
  provider = noopProvider;
}

export async function captureError(error: unknown, context?: MonitoringContext): Promise<void> {
  const normalized = error instanceof Error ? error : new Error(String(error));
  inMemoryErrors.push({
    message: normalized.message,
    context,
    timestamp: new Date().toISOString(),
  });

  try {
    await provider.captureException(normalized, context);
  } catch {
    // Never fail app flows because monitoring backend is unavailable.
  }
}

export function getCapturedErrors(): Array<{ message: string; context?: MonitoringContext; timestamp: string }> {
  return [...inMemoryErrors];
}

export function resetErrorMonitoringForTesting(): void {
  inMemoryErrors.length = 0;
  resetMonitoringProvider();
}
