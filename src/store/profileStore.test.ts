import { describe, expect, it } from 'vitest';
import { updateProfile } from './profileStore';

describe('profileStore', () => {
  it('updates profile fields with patch', () => {
    const user = {
      id: 'u1',
      fullName: 'Old Name',
      email: 'old@example.com',
    };

    const updated = updateProfile(user, {
      fullName: 'New Name',
      phone: '0909123456',
    });

    expect(updated.fullName).toBe('New Name');
    expect(updated.phone).toBe('0909123456');
    expect(updated.email).toBe('old@example.com');
  });
});
