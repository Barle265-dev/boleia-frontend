import type { User } from '../types';

type PermissionRef = {
  allow?: boolean;
  permission: {
    name: string;
  };
};

type ExtendedUser = User & {
  permissions?: PermissionRef[];
  role?: User['role'] & {
    permissions?: PermissionRef[];
  };
  type?: string;
};

export const PERMISSIONS = {
  brandsCreate: 'brands.create',
  brandsUpdate: 'brands.update',
  brandsDelete: 'brands.delete',
  categoriesCreate: 'categories.create',
  categoriesUpdate: 'categories.update',
  categoriesDelete: 'categories.delete',
  productsCreate: 'products.create',
  productsUpdate: 'products.update',
  productsDelete: 'products.delete',
  ordersUpdate: 'orders.update',
  ordersViewAll: 'orders.viewAll',
  usersCreate: 'users.create',
  usersUpdate: 'users.update',
  usersDelete: 'users.delete',
  usersViewAll: 'users.viewAll',
  rolesCreate: 'roles.create',
  rolesUpdate: 'roles.update',
  rolesDelete: 'roles.delete',
  permissionsCreate: 'permissions.create',
  permissionsUpdate: 'permissions.update',
  permissionsDelete: 'permissions.delete',
} as const;

export const ADMIN_PERMISSIONS = [
  PERMISSIONS.brandsCreate,
  PERMISSIONS.brandsUpdate,
  PERMISSIONS.brandsDelete,
  PERMISSIONS.categoriesCreate,
  PERMISSIONS.categoriesUpdate,
  PERMISSIONS.categoriesDelete,
  PERMISSIONS.productsCreate,
  PERMISSIONS.productsUpdate,
  PERMISSIONS.productsDelete,
  PERMISSIONS.ordersUpdate,
  PERMISSIONS.ordersViewAll,
  PERMISSIONS.usersCreate,
  PERMISSIONS.usersUpdate,
  PERMISSIONS.usersDelete,
  PERMISSIONS.usersViewAll,
  PERMISSIONS.rolesCreate,
  PERMISSIONS.rolesUpdate,
  PERMISSIONS.rolesDelete,
  PERMISSIONS.permissionsCreate,
  PERMISSIONS.permissionsUpdate,
  PERMISSIONS.permissionsDelete,
];

export const PRODUCT_ADMIN_PERMISSIONS = [
  PERMISSIONS.productsCreate,
  PERMISSIONS.productsUpdate,
  PERMISSIONS.productsDelete,
];

export const CATEGORY_ADMIN_PERMISSIONS = [
  PERMISSIONS.categoriesCreate,
  PERMISSIONS.categoriesUpdate,
  PERMISSIONS.categoriesDelete,
];

export const BRAND_ADMIN_PERMISSIONS = [
  PERMISSIONS.brandsCreate,
  PERMISSIONS.brandsUpdate,
  PERMISSIONS.brandsDelete,
];

export function getUserPermissions(user: ExtendedUser | null) {
  if (!user) return [];

  const directPermissions =
    user.permissions
      ?.filter((item) => item.allow !== false)
      .map((item) => item.permission.name) ?? [];
  const deniedPermissions =
    user.permissions
      ?.filter((item) => item.allow === false)
      .map((item) => item.permission.name) ?? [];

  const rolePermissions =
    user.role?.permissions?.map((item) => item.permission.name) ?? [];

  return Array.from(new Set([...directPermissions, ...rolePermissions])).filter(
    (permission) => !deniedPermissions.includes(permission),
  );
}

export function hasAnyPermission(user: User | null, permissions: string[]) {
  if (!user) return false;
  if ((user as ExtendedUser).type === 'ADMIN') return true;

  const userPermissions = getUserPermissions(user as ExtendedUser);
  return permissions.some((permission) => userPermissions.includes(permission));
}
