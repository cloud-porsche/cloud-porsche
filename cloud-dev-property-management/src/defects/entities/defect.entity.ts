import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DefectState, IDefect } from '@cloud-porsche/types';

@Entity()
export class Defect extends BaseEntity implements IDefect {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  location: string;
  @Column({ length: 80 })
  descriptionShort: string;
  @Column()
  descriptionLong: string;
  @Column()
  reportedDate: Date;
  @Column({ default: DefectState.OPEN, enum: DefectState })
  status: DefectState;

  constructor(obj: Partial<Defect>) {
    super();
    Object.assign(this, obj);
  }
}
