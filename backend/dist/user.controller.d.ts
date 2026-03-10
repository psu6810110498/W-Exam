import { OnModuleInit } from "@nestjs/common";
import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserController implements OnModuleInit {
    private repo;
    constructor(repo: Repository<User>);
    onModuleInit(): Promise<void>;
    findAll(): any;
    checkin(secret: string): Promise<any>;
}
