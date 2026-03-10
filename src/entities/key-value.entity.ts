import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class KeyValue {
  @PrimaryColumn()
  key!: string; // ชื่อ Key ที่จะเก็บคับ

  @Column('float') // เก็บเป็นตัวเลขทศนิยมก็ได้คับ
  value!: number;
}
