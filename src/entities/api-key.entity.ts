import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  key!: string; // อันนี้คือ Api Key ที่เราต้องส่งมาใน header คับ

  @Column({ default: false })
  canRead!: boolean; // สิทธิ์ในการอ่านข้อมูลคับ

  @Column({ default: false })
  canWrite!: boolean; // สิทธิ์ในการเขียนข้อมูลคับ
}
