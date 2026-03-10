import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db', 
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'my_db',
      entities: [User],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
