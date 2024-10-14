import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefectStates, IDefect } from '@cloud-porsche/types';

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
  @CreateDateColumn()
  reportedDate: Date;
  @Column({ default: DefectStates.OPEN })
  status: DefectStates;

  constructor(obj: Partial<Defect>) {
    super();
    Object.assign(this, obj);
  }
}
