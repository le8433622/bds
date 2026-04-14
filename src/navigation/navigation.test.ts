import { describe, expect, it } from 'vitest';
import { ROUTES } from '../constants/routes';
import { AUTH_ROUTES } from './AuthNavigator';
import { TAB_ROUTES, STACK_ROUTES } from './AppNavigator';
import { ROOT_FLOW } from './RootNavigator';

describe('navigation config', () => {
  it('contains auth routes', () => {
    expect(AUTH_ROUTES).toContain(ROUTES.LOGIN);
    expect(AUTH_ROUTES).toContain(ROUTES.REGISTER);
  });

  it('contains 5 tab routes', () => {
    expect(TAB_ROUTES).toHaveLength(5);
  });

  it('contains all expected stack routes', () => {
    expect(STACK_ROUTES).toEqual([
      ROUTES.PROPERTY_DETAIL,
      ROUTES.CONTACT_AGENT,
      ROUTES.BOOK_VISIT,
      ROUTES.MAP_SEARCH,
      ROUTES.COMPARE_PROPERTIES,
      ROUTES.MY_INQUIRIES,
      ROUTES.HELP_CENTER,
      ROUTES.REPORT_LISTING,
      ROUTES.SETTINGS,
    ]);
  });

  it('exposes root flow structure', () => {
    expect(ROOT_FLOW.splash).toBe(ROUTES.SPLASH);
    expect(ROOT_FLOW.auth).toEqual(AUTH_ROUTES);
    expect(ROOT_FLOW.tabs).toEqual(TAB_ROUTES);
  });
});
