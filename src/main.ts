import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // สร้างแอพ NestJS ขึ้นมาคับ
  const app = await NestFactory.create(AppModule);
  // ให้รันที่ port 3000 หรือตามที่ตั้งใน env คับ
  await app.listen(process.env.PORT ?? 3000);
}
// เรียกใช้ function bootstrap แบบไม่รอผล (ใส่ void ไว้จะได้ไม่แดง)
void bootstrap();
