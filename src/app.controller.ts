import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './api-key.guard';
import { RequirePermission } from './permissions.decorator';

@Controller('kv')
@UseGuards(ApiKeyGuard) // ใช้ Guard กับทุกอันใน controller นี้เลยคับ
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. ดึงข้อมูลจาก Key คับ
  @Get(':key')
  @RequirePermission('read')
  async getKey(@Param('key') key: string) {
    const value = await this.appService.getValue(key);
    return { key, value };
  }

  // 2. เขียนข้อมูลลง Key คับ
  @Post()
  @RequirePermission('write')
  async writeKey(@Body() body: { key: string; value: number }) {
    // ส่งไปให้ service จัดการต่อคับ
    return this.appService.writeValue(body.key, body.value);
  }
}
