import { ROUTES } from '../constants/routes';
import { AUTH_ROUTES } from './AuthNavigator';
import { TAB_ROUTES, STACK_ROUTES } from './AppNavigator';

export const ROOT_FLOW = {
  splash: ROUTES.SPLASH,
  auth: AUTH_ROUTES,
  tabs: TAB_ROUTES,
  appStack: STACK_ROUTES,
} as const;
