import { UserRole } from '../../models/userRole.enum'

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Resource {
 COLORS = 'COLORS',
}

export type Permission = {
  action: Action
  resource: Resource
}

export const ROLES_DICTIONARY: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    { action: Action.CREATE, resource: Resource.COLORS },
    { action: Action.READ, resource: Resource.COLORS },
    { action: Action.UPDATE, resource: Resource.COLORS },
    { action: Action.DELETE, resource: Resource.COLORS },
  ],
  [UserRole.ADMIN]: [
    { action: Action.CREATE, resource: Resource.COLORS },
    { action: Action.READ, resource: Resource.COLORS },
    { action: Action.UPDATE, resource: Resource.COLORS },
  ],
}
