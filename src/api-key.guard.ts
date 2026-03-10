import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { PERMISSIONS_KEY, PermissionType } from './permissions.decorator';
import { Request } from 'express'; // นำเข้า Request จาก express คับ

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(ApiKey)
    private apiKeyRepo: Repository<ApiKey>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ดึง permissions ที่ต้องใช้ใน route นั้นๆ (read หรือ write)
    const requiredPermission = this.reflector.getAllAndOverride<PermissionType>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // ถ้าไม่มีการกำหนด permission ก็ให้ผ่านไปเลยคับ
    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>(); // ใส่ type ให้ request หน่อย เดี๋ยวแดง
    const apiKeyHeader = request.headers['x-api-key'] as string; // ดึง api key จาก header ชื่อ x-api-key

    // ถ้าไม่มี key มาให้ ก็ด่ากลับไปว่าลืมใส่ key คับ
    if (!apiKeyHeader) {
      throw new UnauthorizedException(
        'API Key is missing (ลืมใส่ Key ป่าวคับ)',
      );
    }

    // ไปเช็คใน database ว่ามี key นี้อยู่จริงมั้ย
    const apiKeyEntity = await this.apiKeyRepo.findOne({
      where: { key: apiKeyHeader },
    });

    // ถ้าหาไม่เจอ แสดงว่า key มั่วมาคับ
    if (!apiKeyEntity) {
      throw new UnauthorizedException(
        'Invalid API Key (Key นี้ใช้ไม่ได้นะคับ)',
      );
    }

    // เช็คสิทธิ์การเข้าถึง (Permission Check)
    // ถ้าต้องการอ่าน (read) แต่เจ้าของ key ไม่มีสิทธิ์อ่าน ก็โดนเด้งคับ
    if (requiredPermission === 'read' && !apiKeyEntity.canRead) {
      throw new ForbiddenException(
        'This API Key does not have Read permissions (ไม่มีสิทธิ์อ่านนะคับน้องๆ)',
      );
    }

    // ถ้าต้องการเขียน (write) แต่ไม่มีสิทธิ์เขียน ก็โดนเด้งเหมือนกัน
    if (requiredPermission === 'write' && !apiKeyEntity.canWrite) {
      throw new ForbiddenException(
        'This API Key does not have Write permissions (ไม่มีสิทธิ์เขียนนะคับ)',
      );
    }

    // ถ้าผ่านหมดทุกอย่างก็เข้าใช้งานได้เลยค้าบ
    return true;
  }
}
