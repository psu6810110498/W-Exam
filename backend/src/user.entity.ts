import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    display_name: string;

    @Column({ unique: true })
    secret: string;

    @Column({ type: 'timestamp', nullable: true })
    last_checkin: Date;
}