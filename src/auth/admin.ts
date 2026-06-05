import type { User } from '../types';

export const ADMIN_PERMISSION = 'admin_role';

export function isAdminUser(user: User | null) {
  return Boolean(
    user?.Permissions?.some((item) => item.Permission.name === ADMIN_PERMISSION),
  );
}
