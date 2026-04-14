export type ContactMethod = 'call' | 'chat' | 'form';

export type ContactRequestPayload = {
  propertyId: string;
  fullName: string;
  phone: string;
  message?: string;
  preferredMethod: ContactMethod;
};

export type ContactRequest = ContactRequestPayload & {
  id: string;
  createdAt: string;
};

export type BookVisitPayload = {
  propertyId: string;
  fullName: string;
  phone: string;
  visitDate: string; // ISO
  note?: string;
};

export type BookVisitRequest = BookVisitPayload & {
  id: string;
  createdAt: string;
};
