import { SetMetadata } from '@nestjs/common';

// คีย์สำหรับเก็บค่า permissions ใน Metadata คับ
export const PERMISSIONS_KEY = 'permissions';
// ประเภทของ permission ที่มีให้เลือกคับ
export type PermissionType = 'read' | 'write';

// เอาไว้เรียกใช้บนหัว Controller หรือ Method เพื่อกำหนดสิทธิ์คับ
export const RequirePermission = (permission: PermissionType) =>
  SetMetadata(PERMISSIONS_KEY, permission);
