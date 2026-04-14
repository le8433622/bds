import type { User } from '../types/models';

export type ProfilePatch = Partial<Pick<User, 'fullName' | 'phone' | 'avatar'>>;

export function updateProfile(user: User, patch: ProfilePatch): User {
  return {
    ...user,
    ...patch,
  };
}
