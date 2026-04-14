export type InquiryStatus = 'pending' | 'scheduled' | 'closed';

export function summarizeInquiries(statuses: InquiryStatus[]): Record<InquiryStatus, number> {
  return statuses.reduce(
    (acc, item) => {
      acc[item] += 1;
      return acc;
    },
    { pending: 0, scheduled: 0, closed: 0 } as Record<InquiryStatus, number>,
  );
}
