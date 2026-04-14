import { ROUTES } from '../constants/routes';

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Search: undefined;
  PropertyList: { keyword?: string } | undefined;
  PropertyDetail: { propertyId: string };
  Saved: undefined;
  Notifications: undefined;
  Profile: undefined;
  ContactAgent: { propertyId: string };
  BookVisit: { propertyId: string };
  Settings: undefined;
};
