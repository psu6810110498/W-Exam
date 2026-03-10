import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeyValue } from './entities/key-value.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(KeyValue)
    private kvRepo: Repository<KeyValue>,
  ) {}

  async getValue(key: string): Promise<number> {
    // หาข้อมูลใน db คับ
    const record = await this.kvRepo.findOne({ where: { key } });
    // ถ้าไม่เจอ ก็โยน Error ออกไปเลยคับ
    if (!record)
      throw new NotFoundException(`Key '${key}' not found (หาไม่เจอคับ!)`);
    return record.value;
  }

  async writeValue(key: string, value: number): Promise<KeyValue> {
    // อันนี้คือ Upsert คับ: ถ้ามีอยู่แล้วให้แก้ ถ้าไม่มีให้สร้างใหม่
    const record = await this.kvRepo.preload({ key, value });
    if (!record) {
      // ถ้าหาไม่เจอจริงๆ ก็สร้าง instance ใหม่เลยคับ
      return this.kvRepo.save(this.kvRepo.create({ key, value }));
    }
    // ถ้าเจอ ก็ save ทับไปเลยฮะ
    return this.kvRepo.save(record);
  }
}
