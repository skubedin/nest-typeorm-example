import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from '../../project/models/project.entity';

@Entity()
export class Scheme {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    length: 255,
  })
  public name: string;

  @Column({
    type: 'text',
  })
  public description: string;

  @ManyToOne(() => Project, (project) => project.schemes)
  @JoinColumn({
    foreignKeyConstraintName: 'id',
    name: 'project_id',
  })
  public project: Project;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt: Date;
}
