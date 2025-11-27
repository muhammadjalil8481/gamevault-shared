export interface RoleDocument {
  id: number;
  name: string;
  description?: string;
  is_system: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PermissionDocument {
  id: number;
  category: string;
  action: string;
  created_at: Date;
  updated_at: Date;
}

export interface RolePermissionDocument {
  id: number;
  role_id: number;
  role?: RoleDocument;
  permission_id: number;
  permission: PermissionDocument;
  access: boolean;
  created_at: Date;
  updated_at: Date;
}
