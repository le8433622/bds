import { loadAppConfig } from '../config/appConfig';
import { err, ok, type Result } from '../types/result';
import type { AppConfigError } from '../config/appConfig';
import { createAppRuntime, type AppRuntime } from './runtime';

export type BootstrapOutput = {
  runtime: AppRuntime;
};

export type BootstrapError = AppConfigError;

export function bootstrapAppFromEnv(env: {
  APP_ENV?: string;
  API_BASE_URL?: string;
  API_TIMEOUT_MS?: string;
  API_RETRY_COUNT?: string;
  API_RETRY_DELAY_MS?: string;
  USE_MOCK_API?: string;
}): Result<BootstrapOutput, BootstrapError> {
  const config = loadAppConfig(env);
  if (!config.ok) {
    return err(config.error.code, config.error.message);
  }

  const runtime = createAppRuntime(config.data);

  return ok({ runtime });
}
