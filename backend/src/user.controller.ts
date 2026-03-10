import { Controller, Get, Post, Body, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Controller('User')
export class UserController implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) { }

    async onModuleInit() {
        const count = await this.repo.count();
        if (connt === 0) {
            await this.repo.save([
                { display_name: 'Faeif Yama', secret: '1234' },
                { display_name: 'Boombim EIF', secret: '4245' },
                { display_name: 'Farus Yama', secret: '1412' },
                { display_name: 'Fadel Yama', secret: '3524' },
            ])
            console.log('Fixtures Loaded');

        }
    }

    @Get()
    findAll() {
        return this.repo.find();

    }

    @Post('checkin')
    async checkin(@Body('secret') secret: string) {
        const user = await this.repo.findOneBy({ secret })
        if (!user) throw new NotFoundException('ไม่พบ User ที่ใช้ secret นี้')

        user.last_checkin = new Date();
        return await this.repo.save(user);
    }


}