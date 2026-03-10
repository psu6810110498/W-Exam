import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiKeyGuard } from './api-key.guard';
import { Reflector } from '@nestjs/core';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    // จำลอง (Mock) พวก dependency ใส่เข้าไปใน module คับ
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getValue: jest.fn().mockResolvedValue(100),
            writeValue: jest
              .fn()
              .mockResolvedValue({ key: 'test', value: 100 }),
          },
        },
        Reflector,
        {
          provide: 'ApiKeyRepository', // Mock repository หน่อยคับ
          useValue: {},
        },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({ canActivate: () => true }) // ปิด Guard ไว้ก่อนเวลาเทสคับ
      .compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getKey', () => {
    it('ควรจะคืนค่า value กลับมาเมื่อเรียกใช้ getKey นะคับ', async () => {
      const result = await appController.getKey('test-key');
      expect(result).toEqual({ key: 'test-key', value: 100 });
      // ใช้ jest.mocked หรือ cast เพื่อเลี่ยง lint เรื่อง unbound-method คับ
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(appService.getValue).toHaveBeenCalledWith('test-key');
    });
  });

  describe('writeKey', () => {
    it('ควรจะบันทึกข้อมูลได้เมื่อเรียกใช้ writeKey คับ', async () => {
      const result = await appController.writeKey({
        key: 'new-key',
        value: 50,
      });
      expect(result).toEqual({ key: 'test', value: 100 });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(appService.writeValue).toHaveBeenCalledWith('new-key', 50);
    });
  });
});
