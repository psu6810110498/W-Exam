import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepo: Repository<ApiKey>,
  ) {}

  async onModuleInit() {
    // เช็คว่ามีข้อมูลในตาราง ApiKey หรือยังคับ
    const count = await this.apiKeyRepo.count();

    if (count === 0) {
      console.log(
        '🌱 Database ว่างเปล่าคับ! กำลังสร้าง Api Key เริ่มต้นให้เด้อ...',
      );

      const keys = [
        { key: 'admin-secret', canRead: true, canWrite: true }, // เข้าถึงได้หมดทุกอย่างคับ
        { key: 'reader-only', canRead: true, canWrite: false }, // อ่านได้อย่างเดียวคับ
        { key: 'writer-only', canRead: false, canWrite: true }, // เขียนได้อย่างเดียวคับ
      ];

      await this.apiKeyRepo.save(keys);
      console.log('สร้าง Api Key เสร็จเรียบร้อยแล้วค้าบ! ✅');
    }
  }
}
