import { addViewedProperty, clearViewHistory } from '../../store/viewHistoryStore';

let historyIds: string[] = [];

export async function pushViewedProperty(propertyId: string): Promise<string[]> {
  historyIds = addViewedProperty(historyIds, propertyId);
  return [...historyIds];
}

export async function getViewedHistoryIds(): Promise<string[]> {
  return [...historyIds];
}

export async function clearViewedHistoryIds(): Promise<void> {
  historyIds = clearViewHistory();
}

export function resetViewHistoryStorageForTesting(): void {
  historyIds = [];
}
