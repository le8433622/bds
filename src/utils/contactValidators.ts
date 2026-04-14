import type { BookVisitPayload, ContactRequestPayload } from '../types/contact';
import { isNonEmpty } from './validators';

const PHONE_REGEX = /^[0-9+\-\s]{8,20}$/;

export function isValidPhone(value: string): boolean {
  return PHONE_REGEX.test(value.trim());
}

export function validateContactRequest(input: ContactRequestPayload): string[] {
  const errors: string[] = [];

  if (!isNonEmpty(input.propertyId)) errors.push('Thiếu mã bất động sản.');
  if (!isNonEmpty(input.fullName)) errors.push('Họ tên là bắt buộc.');
  if (!isValidPhone(input.phone)) errors.push('Số điện thoại không hợp lệ.');

  return errors;
}

export function validateBookVisitRequest(input: BookVisitPayload): string[] {
  const errors: string[] = [];

  if (!isNonEmpty(input.propertyId)) errors.push('Thiếu mã bất động sản.');
  if (!isNonEmpty(input.fullName)) errors.push('Họ tên là bắt buộc.');
  if (!isValidPhone(input.phone)) errors.push('Số điện thoại không hợp lệ.');
  if (!isNonEmpty(input.visitDate)) errors.push('Ngày xem nhà là bắt buộc.');

  if (isNonEmpty(input.visitDate)) {
    const timestamp = new Date(input.visitDate).getTime();
    if (Number.isNaN(timestamp)) {
      errors.push('Ngày xem nhà không đúng định dạng.');
    }
  }

  return errors;
}
