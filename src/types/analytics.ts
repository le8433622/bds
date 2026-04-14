export type AnalyticsEventName =
  | 'app_open'
  | 'search_submitted'
  | 'property_saved'
  | 'contact_requested'
  | 'visit_booked'
  | 'recommendation_loaded';

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  timestamp: string;
  payload?: Record<string, string | number | boolean | null>;
};
