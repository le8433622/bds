import { ROOT_FLOW } from './navigation/RootNavigator';
import { createDefaultRuntime } from './app/defaultRuntime';
import type { AppRuntime } from './app/runtime';
import { createAppUiContainer } from './app/uiContainer';

/**
 * App shell contract that UI container can consume.
 */
export const APP_FLOW = ROOT_FLOW;
export const APP_RUNTIME = createDefaultRuntime();

export type AppShellModel = {
  flow: typeof APP_FLOW;
  runtimeMode: AppRuntime['mode'];
  usecases: AppRuntime['usecases'];
  ui: ReturnType<typeof createAppUiContainer>;
};

export function createAppShellModel(
  runtime: AppRuntime = APP_RUNTIME,
  authState: { isLoggedIn: boolean } = { isLoggedIn: false },
): AppShellModel {
  return {
    flow: APP_FLOW,
    runtimeMode: runtime.mode,
    usecases: runtime.usecases,
    ui: createAppUiContainer({
      runtime,
      isLoggedIn: authState.isLoggedIn,
    }),
  };
}

export default function App() {
  return createAppShellModel();
}
