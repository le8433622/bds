import { ROOT_FLOW } from './navigation/RootNavigator';
import { createDefaultRuntime } from './app/defaultRuntime';
import type { AppRuntime } from './app/runtime';

/**
 * App shell contract that UI container can consume.
 */
export const APP_FLOW = ROOT_FLOW;
export const APP_RUNTIME = createDefaultRuntime();

export type AppShellModel = {
  flow: typeof APP_FLOW;
  runtimeMode: AppRuntime['mode'];
  usecases: AppRuntime['usecases'];
};

export function createAppShellModel(runtime: AppRuntime = APP_RUNTIME): AppShellModel {
  return {
    flow: APP_FLOW,
    runtimeMode: runtime.mode,
    usecases: runtime.usecases,
  };
}

export default function App() {
  return createAppShellModel();
}
