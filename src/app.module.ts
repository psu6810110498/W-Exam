import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeyValue } from './entities/key-value.entity';
import { ApiKey } from './entities/api-key.entity';
import { ApiKeyGuard } from './api-key.guard';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ตั้งค่าฐานข้อมูล PostgreSQL คับ
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'bonus_db'),
        entities: [KeyValue, ApiKey],
        synchronize: true, // ใช้เฉพาะตอน dev นะคับ เดี๋ยว db พัง
      }),
    }),
    TypeOrmModule.forFeature([KeyValue, ApiKey]),
  ],
  controllers: [AppController],
  providers: [AppService, SeedService, ApiKeyGuard],
})
export class AppModule { }
