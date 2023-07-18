import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Scheme } from '../../scheme/entities/scheme.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    name: 'name',
    length: 255,
  })
  public name: string;

  @Column({
    type: 'text',
  })
  public description: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({
    foreignKeyConstraintName: 'id',
    name: 'user_id',
  })
  public user: User;

  @OneToMany(() => Scheme, (scheme) => scheme.project)
  public schemes: Scheme[];

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt: Date;
}
